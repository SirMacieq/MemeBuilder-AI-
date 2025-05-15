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
      currentWallet:{wallet.publicKey.toBase58()}
      <br />
      current program id:{api.getProgram(wallet).programId.toBase58()}
      <br />
      <Button type="button" onClick={() => api.initializeTokenFactory(wallet)}>
        Initialize token factory
      </Button>
      <Button
        type="button"
        onClick={() => api.createTokenProposal(wallet, datas.dummyFundedToken)}
      >
        Create token proposal
      </Button>
      <Button
        type="button"
        onClick={async () =>
          api.createUser(wallet, await api.getUserPDA(wallet))
        }
      >
        Create user
      </Button>
      <Button
        type="button"
        onClick={async () =>
          api.getOneUser(wallet, (await api.getUserPDA(wallet)).toBase58())
        }
      >
        get current user pda data
      </Button>
      <Button type="button" onClick={() => api.getAllTokenProposals(wallet)}>
        getAllTokenProposals
      </Button>
      <Button
        type="button"
        onClick={() =>
          api.getOneTokenProposal(
            wallet,
            "EKaoYPXmMXkFqGGpw1KwiX2GbKoeBeCdBbESESR6GEyk",
          )
        }
      >
        getOneTokenProposals
      </Button>
      <Button type="button" onClick={() => onClick()}>
        custom
      </Button>
    </div>
  );
};

export default ChainTesting;
