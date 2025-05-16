//@ts-ignore
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
//@ts-ignore
import * as anchor from "@coral-xyz/anchor";
import idl from "./idl.json";
const dotenv = require("dotenv");
dotenv.config();

const PAYER_KEY = process.env.SOLANA_ADMIN_KEYPAIR;

export const endTokenProposal = async (proposal: any) => {
  if (!PAYER_KEY) {
    return {
      success: false,
      proposalId: proposal.proposal_id,
      error: "SOLANA_ADMIN_KEYPAIR is not set",
    };
  }

  try {
    const secretKey = new Uint8Array(JSON.parse(PAYER_KEY));
    if (!secretKey || secretKey.length === 0) {
      throw new Error("Admin keypair is empty or invalid");
    }

    const adminKeypair = Keypair.fromSecretKey(secretKey);
    const wallet = new Wallet(adminKeypair);
    const connection = new Connection("https://api.devnet.solana.com");
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    const program = new Program(idl, provider);

    const [tokenProposalFactoryAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("token_proposal_factory")],
      program.programId,
    );

    const proposalId = new PublicKey(proposal.proposal_id);

    // get on chain proposal
    const onChainProposalData =
      await program.account.tokenProposal.fetch(proposalId);

    // end Voting period
    const response = await program.methods
      .endTokenProposalVotingPeriod(
        new anchor.BN(onChainProposalData.index).toArrayLike(Buffer, "le", 4),
      )
      .accounts({
        signer: wallet.publicKey,
        tokenProposal: proposalId,
        tokenProposalFactory: tokenProposalFactoryAccountId,
      })
      .rpc();

    // Create mint anchor
    const mintKeypair = Keypair.generate();

    await program.methods
      .createTokenMint()
      .accounts({
        mintAccount: mintKeypair.publicKey,
        payer: wallet.publicKey,
        tokenProposal: proposalId,
      })
      .signers([mintKeypair])
      .rpc();
    return {
      success: true,
      proposalId: proposal.proposal_id,
      tokenId: mintKeypair.publicKey.toBase58(),
    };
  } catch (error: any) {
    return {
      success: false,
      proposalId: proposal.proposal_id,
      error: error.message,
    };
  }
};
