'use server';

import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function searchUser(query: string) {
  await verifyAdmin();
  const supabase = createAdminClient();

  // Search by email or clerk_id
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike.%${query}%,clerk_id.eq.${query}`)
    .limit(10);

  if (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search users');
  }
  return data;
}

export async function adjustCredits(clerkId: string, amount: number, reason: string) {
  await verifyAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.rpc('admin_adjust_credits', {
    p_clerk_id: clerkId,
    p_amount: amount,
    p_reason: reason,
  });

  if (error) {
    console.error('Credit adjustment error:', error);
    throw new Error('Failed to adjust credits');
  }
  revalidatePath('/admin');
}

export async function deleteUserAccount(clerkId: string) {
  await verifyAdmin();
  const supabase = createAdminClient();

  // 1. Delete from profiles (generations and transactions will cascade)
  const { error } = await supabase.from('profiles').delete().eq('clerk_id', clerkId);

  if (error) {
    console.error('User deletion error:', error);
    throw new Error('Failed to delete user');
  }

  // Note: For a complete implementation, you'd also delete the user from Clerk
  // via clerkClient.users.deleteUser(clerkId), but we'll stick to profiles for now.

  revalidatePath('/admin');
}
