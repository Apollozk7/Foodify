import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth();

  // Strict check: only users with role 'admin' in metadata can pass
  // Check sessionClaims.metadata.role
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== 'admin') {
    redirect('/dashboard');
  }

  return <div className="min-h-screen bg-[#000103] text-white">{children}</div>;
}
