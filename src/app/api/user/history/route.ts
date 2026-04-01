import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ⚡ Bolt: Reduced N+1-like query by using an inner join to fetch generations directly by clerk_id
    const { data: generations, error } = await supabaseAdmin
      .from('generations')
      .select('*, profiles!inner(id)')
      .eq('profiles.clerk_id', clerkId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching history:', error);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json(generations);
  } catch (err) {
    console.error('History API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
