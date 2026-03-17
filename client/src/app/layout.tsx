import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

const geistSans = Geist({  // Importing the Geist Sans font from Google Fonts with Latin subset
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({  // Importing the Geist Mono font from Google Fonts with Latin subset
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {   // Metadata for the Next.js application, which can be used for SEO (Search Engine Optimization) and other purposes. It includes a title and description for the app
  title: "Property Marketplace",
  description: "Find your perfect property with AI-powered search",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar/>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
