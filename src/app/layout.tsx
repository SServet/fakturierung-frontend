// File: src/app/layout.tsx
import '@/app/globals.css';
import AuthWrapperClient from '@/components/AuthWrapperClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="emerald">
      <body>
        <AuthWrapperClient>{children}</AuthWrapperClient>
      </body>
    </html>
  );
}
