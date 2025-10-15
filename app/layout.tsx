import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
      <body className={`${monaSans.variable} antialiased pattern`}>
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        <div className="bg-[url('/covers/bg-main.svg')] bg-cover bg-center bg-no-repeat bg-fixed">
          {children}
          <Analytics />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
