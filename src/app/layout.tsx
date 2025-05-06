// File: src/app/layout.tsx
import '../styles/globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
