// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ProvidersWrapper } from './providers-wrapper';
import { metadata as baseMetadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

// Extend existing metadata with favicon
export const metadata = {
  ...baseMetadata,
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}
