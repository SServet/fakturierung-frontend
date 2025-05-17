// src/app/layout.tsx
'use client';

import '../styles/globals.css';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* bg-base-100 = theme background, text-base-content = theme text color */}
      <body className="flex min-h-screen bg-base-100 text-base-content">
        <AuthProvider>
          <LayoutInner>{children}</LayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <>
      {user && <Sidebar />}
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}
