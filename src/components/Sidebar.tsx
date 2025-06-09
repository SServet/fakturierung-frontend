// File: src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="h-screen w-64 p-4 bg-base-200 border-r border-base-300 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Fakturierung</h2>

      <ul className="menu menu-vertical flex-1">
        <li className={pathname === '/dashboard' ? 'active' : ''}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={pathname.startsWith('/invoices') ? 'active' : ''}>
          <Link href="/invoices">Invoices</Link>
        </li>
        <li className={pathname.startsWith('/customers') ? 'active' : ''}>
          <Link href="/customers">Customers</Link>
        </li>
      </ul>

      <div className="mt-auto">
        <button
          onClick={() => logout()}
          className="btn btn-ghost w-full justify-start"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
