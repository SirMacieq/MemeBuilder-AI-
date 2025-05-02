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
    <Button type="button" variant="destructive" onClick={() => delAction()}>
      Delete account
    </Button>
  );
};

export default DeleteAccountButton;
