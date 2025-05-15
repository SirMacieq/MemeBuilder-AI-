import type { Metadata } from "next";
import "../globals.css";
import AppWalletProvider from "@/components/contexts/AppWalletProvider";
import AppHeader from "@/components/organisms/AppHeader";
import AppFooter from "@/components/organisms/AppFooter";
import Hoc from "@/components/Hoc";
import ReduxStoreProvider from "@/components/contexts/ReduxStoreProvider";

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
          <ReduxStoreProvider>
            <Hoc />
            <AppHeader />
            <main className="grow flex">{children}</main>
            <AppFooter />
          </ReduxStoreProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
