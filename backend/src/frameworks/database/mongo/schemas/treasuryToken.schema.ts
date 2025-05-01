import mongoose from "mongoose";

const treasuryTokenSchema = new mongoose.Schema(
  {
    token: {
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      description: { type: String, required: true },
      logoURL: { type: String, required: true }
    },
    chain: { type: String, required: true },
    fundingGoals: {
      lp: { type: Number, required: true },
      treasury: { type: Number, required: true },
      kol: { type: Number, required: true },
      ai: { type: Number, required: true }
    },
    softCap: { type: Number, required: true },
    hardCap: { type: mongoose.Schema.Types.Mixed, required: false }, // number | null
    fundingModel: {
      source: { type: String, required: true },
      basedOnSelectedGoals: { type: Boolean, required: true },
      tokensCreatedOnApproval: { type: Boolean, required: true }
    },
    tokenomics: {
      supply: { type: Number, required: true },
      allocations: {
        lp: { type: Number, required: true },
        daoVoters: { type: Number, required: true },
        airdrop: { type: Number, required: true }
      }
    },
    airdropModules: {
      dropScore: { type: Boolean, required: true },
      gta: { type: Boolean, required: true }
    },
    voting: {
      periodDays: { type: Number, required: true },
      voteUnit: { type: String, required: true },
      quorum: { type: String, required: true },
      escrowedFunds: { type: Boolean, required: true },
      autoExecuteOnApproval: { type: Boolean, required: true }
    },
    eligibilityRequirements: {
      previousSuccess: { type: Boolean, required: true },
      rateLimit: { type: String, required: true }
    },
    proposer_wallet: { type: String, required: true },
    created_at: { type: Number, required: false }
  },
  { collection: "treasury_token_proposals" }
);

const TreasuryTokenModel = mongoose.model("TreasuryToken", treasuryTokenSchema);

export default TreasuryTokenModel;
