"use client";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <>
      <Button>Nice button</Button>
      <WalletMultiButton style={{ borderRadius: "10px" }} />
    </>
  );
}
