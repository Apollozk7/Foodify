import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getGenerationStatus } from "@/lib/fal/client";
import { setCredits } from "@/lib/redis";
import { fal } from "@fal-ai/client";

// Define a safe fallback queue status since the client type might be incomplete for FAILED
type QueueStatus = { status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED" };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id: generationId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch record from Supabase
    const { data: generation, error: genError } = await supabaseAdmin
      .from("generations")
      .select("*, profiles!inner(clerk_id)")
      .eq("id", generationId)
      .single();

    if (genError || !generation) {
      console.error("Error fetching generation:", genError);
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    // 2. Ensure the user owns this generation
    if (generation.profiles.clerk_id !== clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If already done or failed, just return it
    if (generation.status === "done" || generation.status === "failed") {
      return NextResponse.json({
        status: generation.status,
        outputUrl: generation.output_image_url,
      });
    }

    // 3. Call Fal.ai to check status
    type FalStatusResponse = QueueStatus | { status: "FAILED"; error?: unknown };
    const status = (await getGenerationStatus(generation.fal_request_id)) as FalStatusResponse;

    let currentStatus = generation.status;
    let outputUrl = generation.output_image_url;

    if (status.status === "COMPLETED") {
      // 4. Fetch the result if completed
      const result = await fal.queue.result("fal-ai/nano-banana", {
        requestId: generation.fal_request_id,
      });

      // Safely access the image URL. The type definition provides `.data.images`,
      // but in case the actual client payload is flatter or matches previous behavior,
      // we check both structures to prevent regressions.
      const responseData = result.data;
      outputUrl = responseData.images?.[0]?.url || (responseData as { image?: { url: string } }).image?.url;
      currentStatus = "done";

      // Update Supabase
      await supabaseAdmin
        .from("generations")
        .update({
          status: "done",
          output_image_url: outputUrl,
        })
        .eq("id", generationId);

    } else if (status.status === "FAILED" || "error" in status) {
      // Use the new atomic RPC to handle failure and refund
      const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc("handle_generation_failure", {
        p_generation_id: generationId,
        p_clerk_id: clerkId
      });

      if (rpcError) {
        console.error("Error calling handle_generation_failure:", rpcError);
        // Fallback to manual update if RPC fails
        await supabaseAdmin.from("generations").update({ status: "failed" }).eq("id", generationId);
      } else if (rpcData && rpcData.length > 0 && rpcData[0].success) {
        // Refund was successful in DB, now sync Redis with the DB result as truth
        await setCredits(clerkId, rpcData[0].remaining_credits);
      }
      
      currentStatus = "failed";
    } else if (status.status === "IN_PROGRESS") {
      currentStatus = "processing";
      
      if (generation.status !== "processing") {
          await supabaseAdmin
            .from("generations")
            .update({ status: "processing" })
            .eq("id", generationId);
      }
    }

    return NextResponse.json({
      status: currentStatus,
      outputUrl,
    });

  } catch (error) {
    console.error("Error in GET /api/generate/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
