"use client";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import logoutAction from "@/lib/actions/auth/logoutAction";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const LogoutButton = () => {
  const wallet = useWallet();
  function logout() {
    localStorage.removeItem("signed-message");
    wallet.disconnect();
    logoutAction();
  }
  return (
    <Button
      className="text-white border border-[#7912FF] bg-transparent hover:bg-[#0B1739] p-6 rounded-[222px]"
      onClick={() => logout()}
    >
      <Image src="/images/wallet.svg" alt="" width={18} height={18} />{" "}
      Disconnect wallet
    </Button>
  );
};

export default LogoutButton;
