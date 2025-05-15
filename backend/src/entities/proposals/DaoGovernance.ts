import { DaoGovernanceDtoQuery } from "../../types/proposals/daoGovernance-types";

const now = Date.now();

export default class DaoGovernance {
  public proposalType: "daoGovernance" = "daoGovernance";
  public proposal: DaoGovernanceDtoQuery["proposal"];
  public governanceGoals: DaoGovernanceDtoQuery["governanceGoals"];
  public governanceFunding?: DaoGovernanceDtoQuery["governanceFunding"];
  public quorum: number;
  public voting: DaoGovernanceDtoQuery["voting"];
  public proposal_id: string;
  public proposer_wallet: string;
  public created_at: number;

  constructor({
    proposal,
    governanceGoals,
    governanceFunding,
    quorum,
    voting,
    proposal_id,
    proposer_wallet,
    created_at,
  }: Omit<DaoGovernanceDtoQuery, "proposalType"> & { created_at?: number }) {
    this.proposal = proposal;
    this.governanceGoals = governanceGoals;
    this.governanceFunding = governanceFunding;
    this.quorum = quorum;
    this.voting = voting;
    this.proposal_id = proposal_id;
    this.proposer_wallet = proposer_wallet;
    this.created_at = created_at ?? now;
  }
}
