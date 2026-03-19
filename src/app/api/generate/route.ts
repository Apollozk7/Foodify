import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { setCredits } from "@/lib/redis";
import { refinePrompt } from "@/lib/ai/refiner";
import { submitGeneration } from "@/lib/fal/client";
import { z } from "zod";

const generateSchema = z.object({
  imageUrl: z.string().url(),
  prompt: z.string().min(1),
  category: z.string().min(1),
  style: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let clerkId: string | null = null;
  let creditConsumed = false;

  try {
    const { userId } = await auth();
    clerkId = userId;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Validate request body
    const body = await req.json();
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
    }

    const { imageUrl, prompt: userPrompt, category, style } = result.data;

    // 2. Fetch user profile (to verify existence and get internal UUID)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // 3. Fetch prompt template (to verify existence)
    const { data: template, error: templateError } = await supabaseAdmin
      .from("prompt_templates")
      .select("base_prompt, negative_prompt")
      .eq("category", category)
      .eq("style", style)
      .eq("active", true)
      .single();

    if (templateError || !template) {
      console.error("Error fetching template:", templateError);
      return NextResponse.json({ error: "Prompt template not found or inactive" }, { status: 404 });
    }

    // 4. Verify and consume credits
    // Source of truth is the DB RPC for absolute concurrency safety
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc("consume_user_credits", {
      p_clerk_id: clerkId,
      p_amount: 1
    });

    if (rpcError || !rpcData || rpcData.length === 0 || !rpcData[0].success) {
      console.error("RPC Error or Insufficient credits:", rpcError);
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    // Synchronize Redis after successful DB operation
    await setCredits(clerkId, rpcData[0].remaining_credits);
    creditConsumed = true;

    const basePrompts = [template.base_prompt];

    // 5. Refine prompt with Gemini
    const { refined, negative } = await refinePrompt({
      userInput: userPrompt,
      category,
      style,
      templates: basePrompts
    });

    // 6. Submit to Fal.ai
    const falRequestId = await submitGeneration({
      imageUrl,
      prompt: refined,
      negativePrompt: negative || template.negative_prompt || undefined,
    });

    // 7. Create pending record in generations table
    const { data: generation, error: genError } = await supabaseAdmin
      .from("generations")
      .insert({
        user_id: profile.id,
        fal_request_id: falRequestId,
        status: "pending",
        input_image_url: imageUrl,
        user_prompt: userPrompt,
        refined_prompt: refined,
        metadata: {
          category,
          style,
          negative_prompt: negative || template.negative_prompt
        }
      })
      .select("id")
      .single();

    if (genError) {
      console.error("Error creating generation record:", genError);
      throw new Error("Failed to create generation record");
    }

    return NextResponse.json({ generationId: generation.id });

  } catch (error) {
    console.error("Error in /api/generate:", error);

    // Refund credit if consumed and an error occurred before completion
    if (creditConsumed && clerkId) {
      try {
        // Refund in Supabase atomically using the RPC
        const { data: refundData } = await supabaseAdmin.rpc("refund_user_credits", {
          p_clerk_id: clerkId,
          p_amount: 1
        });
        
        if (refundData && refundData.length > 0 && refundData[0].success) {
          // Synchronize Redis with the DB result as truth
          await setCredits(clerkId, refundData[0].remaining_credits);
          console.log(`Successfully refunded and synced credit for user ${clerkId}`);
        }
      } catch (refundError) {
        console.error("Failed to refund credit:", refundError);
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

