//@ts-ignore
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
//@ts-ignore
import * as anchor from "@coral-xyz/anchor";
import idl from "./idl.json";
import fs from "fs";
const dotenv = require("dotenv");
dotenv.config();

const PATH_TO_PAYER_KEY = process.env.SOLANA_ADMIN_KEYPAIR;

export const endTokenProposal = async (proposal: any) => {
  if (!PATH_TO_PAYER_KEY) {
    return {
      success: false,
      proposalId: proposal.proposal_id,
      error: "SOLANA_ADMIN_KEYPAIR is not set",
    };
  }

  try {
    const secretKey = new Uint8Array(
      JSON.parse(fs.readFileSync(PATH_TO_PAYER_KEY, "utf-8"))
    );
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
      program.programId
    );

    const proposalId = new PublicKey(proposal.proposal_id);

    const response = await program.methods
      .endTokenProposalVotingPeriod(
        new anchor.BN(0).toArrayLike(Buffer, "le", 4)
      )
      .accounts({
        signer: wallet.publicKey,
        tokenProposal: proposalId,
        tokenProposalFactory: tokenProposalFactoryAccountId,
      })
      .rpc();
    return {
      success: true,
      proposalId: proposal.proposal_id,
      tokenId: response
    };
  } catch (error: any) {
    return {
      success: false,
      proposalId: proposal.proposal_id,
      error: error.message,
    };
  }
};
