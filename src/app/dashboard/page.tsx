// src/app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/buttons';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const revenueData = [
  { date: 'Jan', revenue: 4000 },
  { date: 'Feb', revenue: 3000 },
  { date: 'Mar', revenue: 5000 },
  { date: 'Apr', revenue: 4000 },
  { date: 'May', revenue: 6000 },
  { date: 'Jun', revenue: 7000 },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">$12,345</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Outstanding Invoices</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">8</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Overdue Payments</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-error">3</CardContent>
          </Card>
        </div>
        <div className="mt-8 bg-base-100 rounded-lg shadow-xl p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#0f766e" fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 gap-4">
          <Button className="w-full sm:w-auto" onClick={() => router.push('/invoices/new')}>
            New Invoice
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.push('/invoices?filter=overdue')}
          >
            Send Reminder
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
