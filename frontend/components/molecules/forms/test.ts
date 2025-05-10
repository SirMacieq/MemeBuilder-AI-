"use client";
import { useEffect } from "react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "@/idl.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
const { PublicKey, SystemProgram } = anchor.web3;
const LAMPORTS_PER_SOL = 1_000_000;

export const ProposalView = () => {
  const connection = new Connection("http://localhost:8899");
  const wallet = useAnchorWallet();

  useEffect(() => {
    console.log("top");

    if (!wallet || !connection) return;

    (async () => {
      //
      //
      //
      // Retrieving provider
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
      //
      //   creating proposal factory PDO
      //
      //
      const [tokenProposalFactoryAccountId, tokenProposalFactoryBump] =
        await PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("token_proposal_factory"),
            new PublicKey(
              "2PVCE27QQ9eFvBZdyNEi6MqgbasvF4ndkYf6UvfvEkvC",
            ).toBytes(),
          ],
          program.programId,
        );
      //
      //
      //
      // creating proposal PDO
      //
      //
      //
      console.log("avant", wallet.publicKey);
      const [tokenProposalAccountId, tokenProposalBump] =
        await PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("token_proposal"),
            tokenProposalFactoryAccountId.toBytes(),
            wallet.publicKey.toBytes(),
          ],
          program.programId,
        );
      console.log("apres");
      //
      //
      // Initializing token proposal factory
      //
      //
      const airdropTx = await connection.requestAirdrop(
        wallet.publicKey,
        2 * LAMPORTS_PER_SOL,
      );
      try {
        const tx = await program.methods
          .initializeTokenProposalFactory()
          .accounts({
            signer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProposalFactory: tokenProposalFactoryAccountId,
          })
          // .signers([wallet])
          .rpc();
        console.log("tx", tx);
      } catch (e) {
        console.log("init error");
        console.log(e);
      }

      // Wait for confirmation.
      // await provider.connection.confirmTransaction(tx);
    })();
  }, [connection, wallet]);

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
  return;
};
