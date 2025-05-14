"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import * as api from "../chain";
import * as datas from "./testingData";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const ChainTesting = () => {
  const wallet = useAnchorWallet();
  if (!wallet) return <div>Wallet not connected</div>;
  const onClick = async () => {
    console.log("bite");
    const program = api.getProgram(wallet);
    const useerPda = await api.getUserPDA(wallet);
    console.log("userPda", useerPda);

    const userPdaData = await program.account.user.fetch(useerPda);
    console.log("userPdaData", userPdaData);
  };

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
      <Button type="button" onClick={() => api.getAllTokenProposals(wallet)}>
        getAllTokenProposals
      </Button>
      <Button type="button" onClick={() => onClick()}>
        custom
      </Button>
    </div>
  );
};

export default ChainTesting;
