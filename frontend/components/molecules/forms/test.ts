"use client";
import { useState, useEffect } from "react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "@/idl.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
const { PublicKey, SystemProgram } = anchor.web3;

export const ProposalView = () => {
  //
  //
  //
  //   creating proposal factory PDO
  //
  //
  const [tokenProposalFactoryAccountId, setTokenProposalFactoryAccountId] =
    useState<any | null>(null);
  useEffect(() => {
    if (!wallet) return;
    (async () => {
      const [tokenProposalFactoryAccountId, tokenProposalFactoryBump] =
        await PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("token_proposal_factory"),
            wallet.publicKey.toBytes(),
          ],
          program.programId,
        );
      setTokenProposalFactoryAccountId(tokenProposalFactoryAccountId);
    })();
  }, []);
  console.log("ici", tokenProposalFactoryAccountId);

  //
  //
  //
  // creating proposal PDO
  //
  //
  //
  const [tokenProposalAccountId, setTokenProposalAccountId] =
    useState<any>(null);
  useEffect(() => {
    if (!wallet) return;
    if (!tokenProposalFactoryAccountId) return;
    (async () => {
      const [tokenProposalAccountId, tokenProposalBump] =
        await PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("token_proposal"),
            tokenProposalFactoryAccountId.toBytes(),
            wallet.publicKey.toBytes(),
          ],
          program.programId,
        );
      //
      setTokenProposalAccountId(tokenProposalAccountId);
    })();
  }, [tokenProposalFactoryAccountId]);
  console.log("accountId", tokenProposalAccountId);

  const connection = new Connection("http://localhost:8899");
  const wallet = useAnchorWallet();

  //
  //
  //
  //
  //
  const getProvider = () => {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    console.log("provider", provider);
    return provider;
  };
  const provider = getProvider();

  const program = new Program(idl, provider);

  //
  //
  // Initializing token proposal factory
  //
  //
  useEffect(() => {
    console.log("top");
    if (!tokenProposalFactoryAccountId) return;
    if (!wallet || !wallet.publicKey) return;
    if (!program.methods) return;

    (async () => {
      try {
        const tx = await program.methods
          .initializeTokenProposalFactory()
          .accounts({
            signer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProposalFactory: tokenProposalFactoryAccountId,
          })
          .rpc();
        console.log("tx", tx);
      } catch (e) {
        console.log(e);
      }

      // Wait for confirmation.
      // await provider.connection.confirmTransaction(tx);
    })();
  }, [tokenProposalFactoryAccountId, wallet, program.methods]);

  return;

  // Generate PDA for the Token Proposal Factory account.

  // Generate PDA for a Token Proposal account.
  //  const token = {
  //    name: "Test Token",
  //    symbol: "TST",
  //    description: "Test Description",
  //    logoUrl: "https://test.com/logo.png",
  //  };
  //  const selectedGoals = {
  //    lp: false,
  //    treasury: false,
  //    kol: false,
  //    ai: false,
  //  };
  //  const fundingGoals = {
  //    lp: 0,
  //    treasury: 0,
  //    kol: 0,
  //    ai: 0,
  //  };
  //  const softCap = 0;
  //  const hardCap = 0;
  //  const fundingModel = {
  //    dynamicUnlock: false,
  //    endsEarlyOnHardCap: false,
  //  };
  //  const airdropModules = {
  //    dropScore: false,
  //  };
  //  const voting = {
  //    periodDays: 0,
  //    voteUnit: "DAYS",
  //    escrowedFund: false,
  //  };
  //
  //  // TODO: create tokenfactory PDA
  // // // TODO: create token factory
  // const createTokenProposal = async (
  //   token,
  //   selectedGoals,
  //   fundingGoals,
  //   softCap,
  //   hardCap,
  //   fundingModel,
  //   airdropModules,
  //   voting,
  // ) => {
  // TODO: create foken proposal PDA

  // try {
  //   // Vote transaction implementation
  //   await program.methods
  //     .createTokenProposal(
  //       token,
  //       selectedGoals,
  //       fundingGoals,
  //       softCap,
  //       hardCap,
  //       fundingModel,
  //       airdropModules,
  //       voting,
  //     )
  //     .accounts({
  //       signer: wallet.publicKey,
  //       systemProgram: SystemProgram.programId,
  //       tokenProposal: tokenProposalAccountId,
  //       tokenProposalFactory: tokenProposalFactoryAccountId,
  //     });
  //   // TODO: create token proposal
  // } catch (error) {
  //   console.error("Error casting vote:", error);
  // }
  // };
  //
  // // Additional UI implementation
};
