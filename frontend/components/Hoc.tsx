"use client";
import logoutAction from "@/lib/actions/auth/logoutAction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import signinAction from "../lib/actions/auth/signinAction";
import { useRouter } from "next/navigation";
import { isLogged } from "@/lib/utils/authUtils/next-token-utils";

const Hoc = () => {
  const wallet = useWallet();
  const router = useRouter();

  useEffect(() => {
    // to grant that the useris logged, we have to make sure some conditions are met:
    // - wallet is connected
    // - cookies are set

    // if (!wallet) return;
    //
    (async () => {
      // skip when transients
      if (wallet.connecting || wallet.disconnecting) return;
      // skip if already connected
      if ((await isLogged()) && wallet.connected) return;

      //try to connect the wallet
      //if success set the cookies and refresh
      //else remove the cookies

      // if the user has already setup its wallet in the app:
      // we should have "walletName" in the local storage
      const isWalletSetup = localStorage.getItem("walletName") !== null;

      if (isWalletSetup) {
        await wallet.connect();
      } else {
        localStorage.removeItem("signed-message");
        localStorage.removeItem("walletName");
        logoutAction();
      }

      // setting the connection cookies
      if (!wallet.publicKey) return;

      const walletId = wallet.publicKey.toString();
      const signedMessageLs = localStorage.getItem("signed-message");
      const message = "connect to USM";

      if (!signedMessageLs) {
        const signedMessageUint8Array = await wallet.signMessage!(
          new TextEncoder().encode(message),
        );
        const signedMessageString = Buffer.from(
          signedMessageUint8Array,
        ).toString("base64");

        localStorage.setItem("signed-message", signedMessageString);
        await signinAction(walletId, signedMessageString, message);
      } else {
        await signinAction(walletId, signedMessageLs, message);
      }

      // finally refresh the page to update the state
      router.refresh();
    })();
    return;
  }, [wallet, router]);

  return null;
};

export default Hoc;
