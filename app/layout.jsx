import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UGCHub - UGC Marketplace Platform',
  description: 'Empowering Creators. Amplifying Brands. Connect with talented creators for authentic user-generated content.',
  keywords: 'UGC, user generated content, marketplace, creators, brands, influencer marketing',
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
