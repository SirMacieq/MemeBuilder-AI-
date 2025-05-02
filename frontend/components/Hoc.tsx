"use client";
import logoutAction from "@/lib/actions/auth/logoutAction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import signinAction from "../lib/actions/auth/signinAction";

const Hoc = () => {
  const wallet = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    if (wallet.connecting || wallet.disconnecting) return;

    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    if (!wallet.publicKey) {
      logoutAction();
    } else {
      const walletId = wallet.publicKey.toString();
      signinAction(walletId);
    }
  }, [wallet, isInitialized]);

  return null;
};

export default Hoc;
