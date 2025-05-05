import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/contexts/AppWalletProvider";
import AppHeader from "@/components/organisms/AppHeader";
import AppFooter from "@/components/organisms/AppFooter";
import Hoc from "@/components/Hoc";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meme Builder(ai)",
  description: "Meme Builder(ai)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AppWalletProvider>
          <Hoc />
          <AppHeader />
          <main className="grow flex">{children}</main>
          <AppFooter />
        </AppWalletProvider>
      </body>
    </html>
  );
}
