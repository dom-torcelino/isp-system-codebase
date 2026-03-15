import { LocaleProvider } from '@/contexts/LocaleContext';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ISP Management Dashboard Design',
  description: "Enterprise ISP Management",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
