import { TokenDtoQuery } from "../../types/token/token-types";

const now = Date.now();

export default class Token {
  public proposalId: string;
  public createdAt: Date;
  public token: TokenDtoQuery["token"];
  public funding: TokenDtoQuery["funding"];
  public tokenomics: TokenDtoQuery["tokenomics"];
  public airdropModules?: TokenDtoQuery["airdropModules"];
  public voting: TokenDtoQuery["voting"];
  public launchMeta?: TokenDtoQuery["launchMeta"];
  public created_at: number;

  constructor({
    proposalId,
    createdAt,
    token,
    funding,
    tokenomics,
    airdropModules,
    voting,
    launchMeta,
    created_at,
  }: TokenDtoQuery & { created_at?: number }) {
    this.proposalId = proposalId;
    this.createdAt = createdAt;
    this.token = token;
    this.funding = funding;
    this.tokenomics = tokenomics;
    this.airdropModules = airdropModules;
    this.voting = voting;
    this.launchMeta = launchMeta;
    this.created_at = created_at ?? now;
  }
}
