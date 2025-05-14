import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "@/idl.json";
import { type MemeBuilderAi } from "@/types/idlType";
import { type AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
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
export const getProgram = (wallet: AnchorWallet) => {
  const provider = getProvider(wallet);
  return new Program<MemeBuilderAi>(idl, provider);
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

  const newCount = parseInt(tokenProposalFactory.tokenProposalCount);

  const [tokenProposalAccountId, tokenProposalBump] =
    // console.log("bn",new BN(0))
    await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("token_proposal"),
        tokenProposalFactoryAccountId.toBytes(),
        new anchor.BN(newCount).toArrayLike(Buffer, "le", 4),
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
    console.log(tx);
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
export const getUserPDA = async (wallet: AnchorWallet) => {
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
export const createUser = async (
  wallet: AnchorWallet,
  userAccountId: anchor.web3.PublicKey,
) => {
  const program = getProgram(wallet);

  const tx = program.methods.createUser().accounts({
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
    user: userAccountId,
  });
  return tx.rpc();
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

  const ids = tokenProposalFactory.tokenProposalIds;

  const tokenProposals = (
    await program.account.tokenProposal.fetchMultiple(ids)
  ).map((p, i) => ({ ...p, id: ids[i].toBase58() }));
  return tokenProposals as OnChainProposalBase[];
};

/**
 * Get One token proposal
 *
 */
export const getOneTokenProposal = async (
  wallet: AnchorWallet,
  proposalIdString: string,
) => {
  const proposalId = new anchor.web3.PublicKey(proposalIdString);
  const program = getProgram(wallet);

  const tokenProposalAccount =
    await program.account.tokenProposal.fetch(proposalId);

  const signatures = await connection.getSignaturesForAddress(proposalId);

  if (!signatures[0].blockTime) throw new Error("blockTime not found");
  const createdAt = signatures.reduce((acc, cur) => {
    if (cur.blockTime) {
      return cur.blockTime < acc ? cur.blockTime : acc;
    } else return acc;
  }, signatures[0].blockTime);

  return {
    ...tokenProposalAccount,
    id: proposalId.toBase58(),
    createdAt: new Date(createdAt * 1000),
  } as OnChainProposal;
};
/**
 * Gets or create contribution PDA
 */
export const getContributionPDA = async (
  wallet: AnchorWallet,
  tokenProposalAccountId: anchor.web3.PublicKey,
) => {
  const program = getProgram(wallet);

  const [contributionAccountId] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("contribution"),
      tokenProposalAccountId.toBytes(),
      wallet.publicKey.toBytes(), // should be admin
    ],
    program.programId,
  );
  return contributionAccountId;
};

/**
 * Contribute to proposal
 */
export const contributeToProposal = async (
  wallet: AnchorWallet,
  proposalIdString: string,
  amount: anchor.BN,
  contributionAccountId: anchor.web3.PublicKey,
  userAccountId: anchor.web3.PublicKey,
) => {
  const proposalId = new anchor.web3.PublicKey(proposalIdString);
  const program = getProgram(wallet);

  const tx = await program.methods
    .contributeToTokenProposal(amount)
    .accounts({
      contribution: contributionAccountId,
      signer: wallet.publicKey, // should be admin
      systemProgram: SystemProgram.programId,
      tokenProposal: proposalId,
      user: userAccountId,
    })
    .rpc();
  return tx;
};
export type OnChainProposalBase = {
  token: {
    name: string;
    symbol: string;
    description: string;
    logoUrl: string;
  };
  selectedGoals: {
    lp: boolean;
    treasury: boolean;
    kol: boolean;
    ai: boolean;
  };
  fundingGoals: {
    lp: number;
    treasury: number;
    kol: number;
    ai: number;
  };
  softCap: number;
  hardCap: number;
  fundingModel: {
    dynamicUnlock: boolean;
    endsEarlyOnHardCap: boolean;
  };
  airdropModules: {
    dropScore: boolean;
  };
  voting: {
    periodDays: number;
    voteUnit: string;
    escrowedFund: boolean;
  };
  amountContributed: anchor.BN;
  contributionCount: number;
  readyToBeFinalized: boolean;
  finalized: boolean;
  completed: boolean;
  owner: anchor.web3.PublicKey;
  /** proposal pubkey in base58 */
  id: string;
};
export interface OnChainProposal extends OnChainProposalBase {
  createdAt: Date;
}
