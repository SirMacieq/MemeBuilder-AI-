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
      (async () => {
        const message = "connect to USM";
        const signedMessageUint8Array = await wallet.signMessage!(
          new TextEncoder().encode(message),
        );
        const signedMessageString = Buffer.from(
          signedMessageUint8Array,
        ).toString("base64");

        await signinAction(walletId, signedMessageString, message);
      })();
    }
  }, [wallet, isInitialized]);

  return null;
};

export default Hoc;
