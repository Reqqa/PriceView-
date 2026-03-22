import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Code_Pro, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navbar";

const sourceCodePro = Raleway({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PriceView",
  description: "Financial tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceCodePro.variable} antialiased`}
        style={{
          background: '#000000',
          minHeight: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        {/* Ambient blobs */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-5%', left: '-5%',
            width: '65vw', height: '65vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,100,30,0.45) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }} />
          <div style={{
            position: 'absolute', top: '10%', right: '-10%',
            width: '55vw', height: '55vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,30,120,0.4) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '25%',
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(80,20,140,0.35) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}