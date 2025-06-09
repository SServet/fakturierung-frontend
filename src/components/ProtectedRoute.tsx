// src/components/ProtectedRoute.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) return null;
  return <>{children}</>;
}
