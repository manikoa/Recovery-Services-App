/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps all pages.
 * It includes the header and footer components.
 * 
 * Implementation notes:
 * - Include the Header and Footer components
 * - Set up metadata for SEO
 * - Configure fonts
 * - Apply global styles
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Header and Footer components when implemented
// import { Header } from "@/components/layout/header";
// import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recovery Services App",
  description: "Connecting individuals with essential recovery resources and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}
      >
        {/* Add Header component here */}
        <header className="border-b">
          <div className="container py-4">
            <h1 className="text-xl font-bold">Recovery Services</h1>
          </div>
        </header>
        
        <main className="flex-1">{children}</main>
        
        {/* Add Footer component here */}
        <footer className="border-t">
          <div className="container py-4 text-center">
            <p>© {new Date().getFullYear()} Community Change Team</p>
          </div>
        </footer>
      </body>
    </html>
  );
}