import type { Metadata } from "next";
import "./../globals.css";
import AppWalletProvider from "@/components/contexts/AppWalletProvider";
import AppFooter from "@/components/organisms/AppFooter";
import Hoc from "@/components/Hoc";
import HeaderHome from "@/components/organisms/HeaderHome";

export const metadata: Metadata = {
  title: "Meme Builder(ai)",
  description: "Meme Builder(ai)",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased flex flex-col min-h-screen`}>
        <AppWalletProvider>
          <Hoc />
          <HeaderHome />
          <main className="grow flex">{children}</main>
          <AppFooter />
        </AppWalletProvider>
      </body>
    </html>
  );
}
