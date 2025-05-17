// File: src/components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64 p-4 bg-base-100 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Fakturierung</h2>
      <ul className="menu menu-vertical">
        <li className={pathname === '/dashboard' ? 'active' : ''}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={pathname.startsWith('/invoices') ? 'active' : ''}>
          <Link href="/invoices">Invoices</Link>
        </li>
        <li className={pathname.startsWith('/customers') ? 'active' : ''}>
          <Link href="/customers">Clients</Link>
        </li>
      </ul>
    </aside>
  )
}
