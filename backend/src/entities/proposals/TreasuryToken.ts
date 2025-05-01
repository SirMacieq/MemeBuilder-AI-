import { TreasuryTokenDtoQuery } from "../../types/proposals/treasuryToken-types";

const now = Date.now();

export default class TreasuryToken {
  public proposalType: "treasuryToken" = "treasuryToken";
  public token: TreasuryTokenDtoQuery["token"];
  public chain: string;
  public fundingGoals: TreasuryTokenDtoQuery["fundingGoals"];
  public softCap: number;
  public hardCap: number | null;
  public fundingModel: TreasuryTokenDtoQuery["fundingModel"];
  public tokenomics: TreasuryTokenDtoQuery["tokenomics"];
  public airdropModules: TreasuryTokenDtoQuery["airdropModules"];
  public voting: TreasuryTokenDtoQuery["voting"];
  public eligibilityRequirements: TreasuryTokenDtoQuery["eligibilityRequirements"];
  public proposer_wallet: string;
  public created_at: number;

  constructor({
    token,
    chain,
    fundingGoals,
    softCap,
    hardCap,
    fundingModel,
    tokenomics,
    airdropModules,
    voting,
    eligibilityRequirements,
    proposer_wallet,
    created_at,
  }: Omit<TreasuryTokenDtoQuery, "proposalType"> & { created_at?: number }) {
    this.token = token;
    this.chain = chain;
    this.fundingGoals = fundingGoals;
    this.softCap = softCap;
    this.hardCap = hardCap;
    this.fundingModel = fundingModel;
    this.tokenomics = tokenomics;
    this.airdropModules = airdropModules;
    this.voting = voting;
    this.eligibilityRequirements = eligibilityRequirements;
    this.proposer_wallet = proposer_wallet;
    this.created_at = created_at ?? now;
  }
}
