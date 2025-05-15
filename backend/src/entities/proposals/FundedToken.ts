import { FundedTokenDtoQuery } from "../../types/proposals/fundedToken-types";

const now = Date.now();

export default class FundedToken {
  public token: FundedTokenDtoQuery["token"];
  public selectedGoals: FundedTokenDtoQuery["selectedGoals"];
  public fundingGoals: FundedTokenDtoQuery["fundingGoals"];
  public softCap: number;
  public hardCap: number | "dynamic";
  public fundingModel: FundedTokenDtoQuery["fundingModel"];
  public airdropModules?: FundedTokenDtoQuery["airdropModules"];
  public voting: FundedTokenDtoQuery["voting"];
  public proposal_id: string;
  public proposer_wallet: string;
  public created_at: number;

  constructor({
    token,
    selectedGoals,
    fundingGoals,
    softCap,
    hardCap,
    fundingModel,
    airdropModules,
    voting,
    proposal_id,
    proposer_wallet,
    created_at,
  }: FundedTokenDtoQuery & { created_at?: number }) {
    this.token = token;
    this.selectedGoals = selectedGoals;
    this.fundingGoals = fundingGoals;
    this.softCap = softCap;
    this.hardCap = hardCap;
    this.fundingModel = fundingModel;
    this.airdropModules = airdropModules;
    this.voting = voting;
    this.proposal_id = proposal_id;
    this.proposer_wallet = proposer_wallet;
    this.created_at = created_at ?? now;
  }
}
