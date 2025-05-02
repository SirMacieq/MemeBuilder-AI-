"use client";
import logoutAction from "@/lib/actions/auth/logoutAction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import signinAction from "../lib/actions/auth/signinAction";

/**
 * Component used to keep our app session in sync with
 * the wallet adapter connection state
 */
const Hoc = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connecting || wallet.disconnecting) return;
    if (!wallet.publicKey) {
      logoutAction();
    } else {
      const walletId = wallet.publicKey.toString();
      signinAction(walletId);
    }
  }, [wallet, wallet.publicKey]);

  return "";
};

export default Hoc;
