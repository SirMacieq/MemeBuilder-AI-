"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import deleteUser from "@/lib/actions/user/deleteAccount";
import React from "react";

const DeleteAccountButton = () => {
  const wallet = useWallet();

  async function delAction() {
    await deleteUser();
    await wallet.disconnect();
  }

  return (
    <Button
      type="button"
      className="bg-transparent mt-4 hover:bg-transparent hover:text-red-500 hover:scale-105 transition-all duration-300 ease-in-out"
      variant="destructive"
      onClick={() => delAction()}
    >
      Delete account
    </Button>
  );
};

export default DeleteAccountButton;
