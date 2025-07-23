import AuthButton from '@/components/AuthButton'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Agent",
  description: "An Nextjs powered AI interview platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.variable} antialiased pattern`}
      > 
      <div className='root-layout'>
        <nav>
          <div className='flex flex-row justify-between gap-4'>
            <Link href="/" className='flex items-center gap-2'>
                <Image src="/logo.svg" alt='Logo' width={38} height={32}/>
                <h2 className='text-primary-100'> AI Interview Agent</h2>
              </Link>
              <div className='flex flex-row gap-6'>
                <AuthButton />
              </div>
          </div>
          
        </nav>
        {children}  
      </div>
      
        
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
