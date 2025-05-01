"use client";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import signinAction from "../lib/actions/auth/signinAction";
import logoutAction from "@/lib/actions/auth/logoutAction";

/**
 * Component used to keep our app session in sync with
 * the wallet adapter connection state
 */
const Hoc = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.publicKey) return;
    const walletId = wallet.publicKey.toString();
    signinAction(walletId);
  }, [wallet.publicKey]);

  useEffect(() => {
    if (wallet.connected) return;
    logoutAction();
  }, [wallet.connected]);
  return "";
};

export default Hoc;
