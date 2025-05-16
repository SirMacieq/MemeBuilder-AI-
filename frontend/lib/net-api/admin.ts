import { BN } from "@coral-xyz/anchor";
import { type AnchorWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as chain from "./chain";

export const endTokenProposalVotingPeriod = async (
  wallet: AnchorWallet,
  tokenProposalAccountId: PublicKey,
) => {
  const program = chain.getProgram(wallet);
  const tokenProposalFactoryAccountId =
    await chain.getProposalFactoryPDA(wallet);
  const proposalPdaData = await program.account.tokenProposal.fetch(
    tokenProposalAccountId,
  );
  const tx = await program.methods
    .endTokenProposalVotingPeriod(proposalPdaData.index)
    .accounts({
      signer: wallet.publicKey,
      tokenProposal: tokenProposalAccountId,
      tokenProposalFactory: tokenProposalFactoryAccountId,
    })
    .rpc();
  console.log("tx", tx);
};
export const createMintToken = async (
  wallet: AnchorWallet,
  tokenProposalAccountId: PublicKey,
) => {
  const program = chain.getProgram(wallet);
  const mintKeypair = Keypair.generate();

  const transactionSignature = await program.methods
    .createTokenMint()
    .accounts({
      mintAccount: mintKeypair.publicKey,
      payer: wallet.publicKey,
      tokenProposal: tokenProposalAccountId,
    })
    .signers([mintKeypair])
    .rpc();

  console.log("Mint Address: ", mintKeypair.publicKey);
  console.log("Transaction Signature: ", transactionSignature);
};
