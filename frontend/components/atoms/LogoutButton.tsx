"use client";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import logoutAction from "@/lib/actions/auth/logoutAction";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const wallet = useWallet();
  function logout() {
    wallet.disconnect();
    logoutAction();
  }
  return <Button onClick={() => logout()}>Logout</Button>;
};

export default LogoutButton;
