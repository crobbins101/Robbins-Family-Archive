import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robbins Family Archive",
  description: "A digital vault for our family memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. We remove 'antialiased' if it's causing issues, 
    // and ensure the theme starts as 'light' or 'dark'
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
        {/* Optional: You could add a Header here that contains the ThemeToggle */}
        {children}
      </body>
    </html>
  );
}