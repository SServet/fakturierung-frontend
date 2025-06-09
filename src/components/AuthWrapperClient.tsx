// File: src/components/AuthWrapperClient.tsx
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/Sidebar';

export default function AuthWrapperClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}

function InnerLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // don’t show sidebar on login or register pages
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      {user && !isAuthPage && <Sidebar />}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
