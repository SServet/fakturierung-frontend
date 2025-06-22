// src/components/ProtectedRoute.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface Props { children: ReactNode; }

export function ProtectedRoute({ children }: Props) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // once initialization is done, if no user → redirect
    if (!initializing && user === null) {
      router.replace('/login');
    }
  }, [initializing, user, router]);

  // While checking token, render nothing (or a spinner)
  if (initializing) return null;

  // If user is null (and init finished), ProtectedRoute will already have redirected,
  // but we must not render protected content unless user exists:
  if (user === null) return null;

  return <>{children}</>;
}
