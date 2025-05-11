"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import * as api from "../chain";
import * as datas from "./testingData";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const ChainTesting = () => {
  const wallet = useAnchorWallet();
  if (!wallet) return <div>Wallet not connected</div>;
  return (
    <div>
      <Button type="button" onClick={() => api.initializeTokenFactory(wallet)}>
        Initialize token factory
      </Button>
      <Button
        type="button"
        onClick={() => api.createTokenProposal(wallet, datas.dummyFundedToken)}
      >
        Create token proposal
      </Button>
      <Button type="button" onClick={() => api.createUser(wallet)}>
        Create user
      </Button>
    </div>
  );
};

export default ChainTesting;
