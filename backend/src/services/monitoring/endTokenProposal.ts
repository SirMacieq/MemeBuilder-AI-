import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import idl from "./idl.json";
import fs from "fs";

const PATH_TO_PAYER_KEY = "adminKeypair";

export const endTokenProposal = async (proposals: any[]) => {
  // setup program & wallet

  const secretKey = new Uint8Array(
    JSON.parse(fs.readFileSync(PATH_TO_PAYER_KEY, "utf-8")),
  );
  if (!secretKey || secretKey.length === 0)
    throw new Error(
      "no admin keypair provided, please add a keypair in the file " +
        PATH_TO_PAYER_KEY,
    );

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

  // getting all proposals pubkey

  const proposalsIds = proposals.map((p) => new PublicKey(p.proposal_id));

  // actually end token proposals

  const promises = proposalsIds.map(async (proposalId) => {
    await program.methods
      .endTokenProposalVotingPeriod(
        new anchor.BN(0).toArrayLike(Buffer, "le", 4),
      )
      .accounts({
        signer: wallet.publicKey,
        tokenProposal: proposalId,
        tokenProposalFactory: tokenProposalFactoryAccountId,
      })
      .rpc();
  });
};
