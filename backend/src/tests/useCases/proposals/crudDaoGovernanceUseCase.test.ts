import { crudUseCaseTests } from "../crudUseCaseTestCreator";
import repositories from "../../../frameworks/repositories/inMemory";
import useCases from "../../../useCases";
import { DaoGovernanceDtoQuery } from "../../../types/proposals/daoGovernance-types";
import DaoGovernance from "../../../entities/proposals/DaoGovernance";


describe("DaoGovernance CRUD Test", () => {
  const daoGovernance1: DaoGovernanceDtoQuery = new DaoGovernance({
    proposal: {
      name: "Create SubDAO for Community Growth",
      description: "Proposal to create a new SubDAO focused on community-driven initiatives and engagement.",
      relatedLinks: [
        "https://dao-website.com/community-subdao-details",
        "https://dao-website.com/resources"
      ]
    },
    governanceGoals: {
      subDAO: true,
      fundsAllocation: 100000,
      otherActions: false
    },
    governanceFunding: {
      subDAOCreation: 100000,
      generalReserve: 50000
    },
    quorum: 51,
    voting: {
      periodDays: 5,
      voteUnit: "1 NFT or token equivalent = 1 vote"
    },
    proposal_id: "llsfgblvfdvss",
    proposer_wallet: "wallet-gov-001"
  });

  const daoGovernance2: DaoGovernanceDtoQuery = new DaoGovernance({
    proposal: {
      name: "DAO Treasury Reserve Adjustment",
      description: "Proposal to reallocate 50,000 USD from the general reserve to a strategic initiatives fund.",
      relatedLinks: ["https://dao-website.com/treasury-adjustment"]
    },
    governanceGoals: {
      subDAO: false,
      fundsAllocation: 50000,
      otherActions: true
    },
    governanceFunding: {
      subDAOCreation: 0,
      generalReserve: 50000
    },
    quorum: 51,
    voting: {
      periodDays: 5,
      voteUnit: "1 NFT or token equivalent = 1 vote"
    },
    proposal_id: "dvbsdbsfgblvfdvss",
    proposer_wallet: "wallet-gov-002"
  });

  crudUseCaseTests<DaoGovernanceDtoQuery>({
    repositories,
    useCases,
    newEntity1: daoGovernance1,
    newEntity2: daoGovernance2,
    useCaseName: "daoGovernance"
  });
});
