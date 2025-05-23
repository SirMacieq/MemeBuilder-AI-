"use client";
import React from "react";
import { useRouter } from "next/navigation";
import logoutAction from "@/lib/actions/auth/logoutAction";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

const LogoutButton = () => {
  const router = useRouter();
  const wallet = useWallet();

  async function logout() {
    localStorage.removeItem("signed-message");
    localStorage.removeItem("walletName");
    await logoutAction();
    wallet.disconnect();

    router.push("/");
  }
  return (
    <Button
      className="bg-none shadow-none hover:bg-radial-[at_50%_50%] text-white border border-[#7912FF] bg-transparent hover:bg-[#0B1739] p-6 rounded-[222px]"
      onClick={() => logout()}
      type="button"
    >
      <Image src="/images/wallet.svg" alt="" width={18} height={18} />{" "}
      Disconnect wallet
    </Button>
  );
};

export default LogoutButton;
