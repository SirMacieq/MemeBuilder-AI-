"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import getSolanaCluster from "@/lib/envGetters/getSolanaCluster";

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cluster = useMemo(getSolanaCluster, []);
  const network = useMemo(() => {
    switch (cluster) {
      case "devnet":
        return WalletAdapterNetwork.Devnet;
      case "mainnet":
        return WalletAdapterNetwork.Mainnet;
    }
  }, [cluster]);

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
