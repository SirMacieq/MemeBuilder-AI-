import { crudUseCaseTests } from "../crudUseCaseTestCreator"
import repositories from "../../../frameworks/repositories/inMemory"
import useCases from "../../../useCases"
import { FundedTokenDtoQuery } from "../../../types/proposals/fundedToken-types"
import FundedToken from "../../../entities/proposals/FundedToken"

describe("User CRUD Test", () => {
    const fundedToken1: FundedTokenDtoQuery = new FundedToken({
        token: {
          name: "TurboFrog",
          symbol: "TFROG",
          description: "TurboFrog is the fastest memecoin on-chain. Powered by the DAO.",
          logoUrl: "https://memesite.xyz/turbofrog.png"
        },
        selectedGoals: {
          lp: true,
          treasury: true,
          kol: false,
          ai: false
        },
        fundingGoals: {
          lp: 40500,
          treasury: 36000,
          kol: 10800,
          ai: 2700
        },
        softCap: 90000,
        hardCap: "dynamic",
        fundingModel: {
          dynamicUnlock: true,
          endsEarlyOnHardCap: true
        },
        airdropModules: {
          dropScore: true
        },
        voting: {
          periodDays: 5,
          voteUnit: "1 NFT or token equivalent = 1 vote",
          escrowedFunds: true
        },
        proposal_id: "lbsfbfbfevb",
        proposer_wallet: "wallet-fr-001"
      });

      const fundedToken2: FundedTokenDtoQuery = new FundedToken({
        token: {
          name: "PepeAI",
          symbol: "PEPAI",
          description: "Pepe with brains. Meme and AI unite!",
          logoUrl: "https://memesite.xyz/pepeai.png"
        },
        selectedGoals: {
          lp: true,
          treasury: false,
          kol: true,
          ai: true
        },
        fundingGoals: {
          lp: 50000,
          treasury: 0,
          kol: 15000,
          ai: 3000
        },
        softCap: 68000,
        hardCap: 80000,
        fundingModel: {
          dynamicUnlock: false,
          endsEarlyOnHardCap: true
        },
        airdropModules: {
          dropScore: false
        },
        voting: {
          periodDays: 5,
          voteUnit: "1 NFT = 1 vote",
          escrowedFunds: true
        },
        proposal_id: "lbsfbfbdddsvb",
        proposer_wallet: "wallet-fr-002"
      });

  crudUseCaseTests<FundedTokenDtoQuery>({
    repositories,
    useCases,
    newEntity1: fundedToken1,
    newEntity2: fundedToken2,
    useCaseName: "fundedToken"
  })
})
