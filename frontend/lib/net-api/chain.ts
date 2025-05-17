import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "@/idl.json";
import { type FundedTokenProposal } from "@/types/idlType";
import { type AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { dummyFundedToken } from "./testing/testingData";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import getSolanaCluster from "../envGetters/getSolanaCluster";
import type { BN } from "@coral-xyz/anchor";

type FundedTokenCreate = typeof dummyFundedToken;

const { PublicKey, SystemProgram } = anchor.web3;

const cluster = getSolanaCluster();
let network: WalletAdapterNetwork;
switch (cluster) {
  case "devnet":
    network = WalletAdapterNetwork.Devnet;
    break;
  case "mainnet":
    network = WalletAdapterNetwork.Mainnet;
    break;
}

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
  return new Program<FundedTokenProposal>(idl, provider);
};

/**
 * Create or gets proposal factory PDA
 */
export const getProposalFactoryPDA = async (wallet: AnchorWallet) => {
  const program = getProgram(wallet);

  const [tokenProposalFactoryAccountId] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("token_proposal_factory"),
      // wallet.publicKey.toBytes(), //admin
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

  //@ts-ignore
  const newCount = parseInt(tokenProposalFactory.tokenProposalCount);

  //@ts-ignore
  const [tokenProposalAccountId, tokenProposalBump] =
    await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("token_proposal"),
        new anchor.BN(newCount).toArrayLike(Buffer, "le", 4),
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
  console.debug("programid", program.programId.toBase58());
  const tokenProposalFactoryAccountId = await getProposalFactoryPDA(wallet);
  console.debug("tokenProposalFactoryAccountId", tokenProposalFactoryAccountId);
  const tkpdata = await program.account.tokenProposalFactory.fetchNullable(
    tokenProposalFactoryAccountId,
  );
  console.debug("tkpdata", tkpdata);
  try {
    const tx = await program.methods
      .initializeTokenProposalFactory()
      .accounts({
        signer: wallet.publicKey,
        //@ts-ignore
        systemProgram: SystemProgram.programId,
        tokenProposalFactory: tokenProposalFactoryAccountId,
      })
      .rpc();
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
  console.debug("tokenProposalAccountId", tokenProposalAccountId.toBase58());

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
      //@ts-ignore
      systemProgram: SystemProgram.programId,
      tokenProposal: tokenProposalAccountId,
      tokenProposalFactory: tokenProposalFactoryAccountId,
    })
    .rpc({ commitment: "confirmed" });
  return { tx, tokenProposalAccountId };
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
  console.debug("fn: createUser");
  const program = getProgram(wallet);

  const tx = program.methods.createUser().accounts({
    signer: wallet.publicKey,
    //@ts-ignore
    systemProgram: SystemProgram.programId,
    user: userAccountId,
  });
  const returnTx = await tx.rpc();
  console.debug("returnTx", returnTx);
  return returnTx;
};
/**
 * Get One user
 */
export const getOneUser = async (
  wallet: AnchorWallet,
  userAccountId: string,
) => {
  console.debug("fn: getOneUser");
  const program = getProgram(wallet);
  const userPdaId = new PublicKey(userAccountId);

  const userData = await program.account.user.fetch(userPdaId);
  console.debug("userData", userData);
  return userData;
};

/**
 * Get all token proposals
 */
export const getAllTokenProposals = async (wallet: AnchorWallet) => {
  console.debug("fn: getAllTokenProposals");
  const program = getProgram(wallet);
  const tokenProposalFactoryAccountId = await getProposalFactoryPDA(wallet);

  const tokenProposalFactory = await program.account.tokenProposalFactory.fetch(
    tokenProposalFactoryAccountId,
  );

  const ids = tokenProposalFactory.tokenProposalIds;

  const tokenProposals = (
    await program.account.tokenProposal.fetchMultiple(ids)
  ).map((p, i) => ({ ...p, id: ids[i].toBase58() }));
  console.debug("tokenProposals", tokenProposals);
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
  console.debug("fn: getOneTokenProposal");
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

  const proposalReturn = {
    ...tokenProposalAccount,
    id: proposalId.toBase58(),
    createdAt: new Date(createdAt * 1000),
  } as OnChainProposal;

  console.debug("proposalReturn", proposalReturn);
  return proposalReturn;
};
/**
 * Gets or create contribution PDA
 */
export const getContributionPDA = async (
  wallet: AnchorWallet,
  tokenProposalAccountId: anchor.web3.PublicKey,
) => {
  console.debug("fn: getContributionPDA");
  const program = getProgram(wallet);

  const [contributionAccountId] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("contribution"),
      tokenProposalAccountId.toBytes(),
      wallet.publicKey.toBytes(),
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
  console.debug("fn: contributeToProposal");
  const proposalId = new anchor.web3.PublicKey(proposalIdString);
  const program = getProgram(wallet);

  const tx = await program.methods
    .contributeToTokenProposal(amount)
    .accounts({
      //@ts-ignore
      contribution: contributionAccountId,
      signer: wallet.publicKey, // should be admin
      systemProgram: SystemProgram.programId,
      tokenProposal: proposalId,
      user: userAccountId,
    })
    .rpc({ commitment: "confirmed" });
  return tx;
};

//
// TYPES
//
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
  softCap: BN;
  hardCap: BN;
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
  owner: anchor.web3.PublicKey;
  /** proposal pubkey in base58 */
  id: string;

  status: string;

  // timestamps
  hardCapReachedAt: BN;
  passedAt: BN;
  rejectedAt: BN;
  softCapReachedAt: BN;
  updatedAt: BN;
  votingEndedAt: BN;
  votingStartedAt: BN;
};
export interface OnChainProposal extends OnChainProposalBase {
  createdAt: Date;
}
