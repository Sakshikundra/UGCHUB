import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UGCHub - UGC Marketplace Platform',
  description: 'Empowering Creators. Amplifying Brands. Connect with talented creators for authentic user-generated content.',
  keywords: 'UGC, user generated content, marketplace, creators, brands, influencer marketing',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
