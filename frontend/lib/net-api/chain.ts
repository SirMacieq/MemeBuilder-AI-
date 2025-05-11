import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "@/idl.json";
import { type AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { dummyFundedToken } from "./testing/testingData";

type FundedTokenCreate = typeof dummyFundedToken;

const { PublicKey, SystemProgram } = anchor.web3;

const LAMPORTS_PER_SOL = 1_000_000;

const connection = new Connection("https://api.devnet.solana.com");

/**
 * Gets Provider
 */
const getProvider = (wallet: AnchorWallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return provider;
};

/**
 * Gets program
 */
const getProgram = (wallet: AnchorWallet) => {
  const provider = getProvider(wallet);
  return new Program(idl, provider);
};

/**
 * Create or gets proposal factory PDA
 */
const getProposalFactoryPDA = async (wallet: AnchorWallet) => {
  const program = getProgram(wallet);

  const [tokenProposalFactoryAccountId, tokenProposalFactoryBump] =
    await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("token_proposal_factory"),
        wallet.publicKey.toBytes(),
      ],
      program.programId,
    );
  return tokenProposalFactoryAccountId;
};

/**
 * Gets or create Proposal PDA
 */
const getTokenProposalPDA = async (
  wallet: AnchorWallet,
  tokenProposalFactoryAccountId: anchor.web3.PublicKey,
) => {
  const program = getProgram(wallet);

  const tokenProposalFactory = await program.account.tokenProposalFactory.fetch(
    tokenProposalFactoryAccountId,
  );

  const newCount = parseInt(tokenProposalFactory.tokenProposalCount)

  const [tokenProposalAccountId, tokenProposalBump] =
    // console.log("bn",new BN(0))
    await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("token_proposal"),
        tokenProposalFactoryAccountId.toBytes(),
        new anchor.BN(newCount).toArrayLike(Buffer,'le',4),
        wallet.publicKey.toBytes(),

      ],
      program.programId,
    );
  return tokenProposalAccountId;
};

/**
 * Initialize token factory
 */
export const initializeTokenFactory = async (wallet: AnchorWallet) => {
  const program = getProgram(wallet);
  const tokenProposalFactoryAccountId = await getProposalFactoryPDA(wallet);

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
    console.log(tx)
    return tx;
  } catch (e) {
    console.log("init error");
    console.log(e);
  }
};

/**
 * Create token proposal
 */
export const createTokenProposal = async (
  wallet: AnchorWallet,
  data: FundedTokenCreate,
) => {
  const program = getProgram(wallet);
  const tokenProposalFactoryAccountId = await getProposalFactoryPDA(wallet);
  const tokenProposalAccountId = await getTokenProposalPDA(
    wallet,
    tokenProposalFactoryAccountId,
  );

  const tx = await program.methods
    .createTokenProposal(
      data.token,
      data.selectedGoals,
      data.fundingGoals,
      data.softCap,
      data.hardCap,
      data.fundingModel,
      data.airdropModules,
      data.voting,
    )
    .accounts({
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      tokenProposal: tokenProposalAccountId,
      tokenProposalFactory: tokenProposalFactoryAccountId,
    })
    .rpc();
  return tx;
};

/**
 * Gets or create user PDA
 */
const getUserPDA = async (wallet: AnchorWallet) => {
  const program = getProgram(wallet);
  const [userAccountId, userBump] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("user"), wallet.publicKey.toBytes()],
    program.programId,
  );
  return userAccountId;
};

/**
 * Creates User
 */
export const createUser = async (wallet: AnchorWallet) => {
  const program = getProgram(wallet);
  const userAccountId = await getUserPDA(wallet);
  const tx = await program.methods
    .createUser()
    .accounts({
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      user: userAccountId,
    })
    .rpc();
  return tx;
};

/**
 * Get all token proposals
 */
export const getAllTokenProposals = async (wallet: AnchorWallet) => {
  const program = getProgram(wallet);
  const tokenProposalFactoryAccountId = await getProposalFactoryPDA(wallet);

  const tokenProposalFactory = await program.account.tokenProposalFactory.fetch(
    tokenProposalFactoryAccountId,
  );
  console.log("tokenProposalFactory",tokenProposalFactory)

  const tokenProposals = await Promise.all(
    tokenProposalFactory.tokenProposalIds.map(async (proposalId:typeof PublicKey) => {
      const tokenProposalAccount = await program.account.tokenProposal
        .fetch(proposalId);
      return tokenProposalAccount
    })
  )
  console.log("tokenProposals",tokenProposals)
  return tokenProposals
}

/**
 * Get All
 */
