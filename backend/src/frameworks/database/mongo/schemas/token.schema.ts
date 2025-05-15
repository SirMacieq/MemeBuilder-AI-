import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    proposalId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    token: {
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      description: { type: String, required: true },
      logoUrl: { type: String },
      totalSupply: { type: Number, required: true },
      tokenAddress: { type: String, required: true },
      network: { type: String, enum: ["solana", "sonic"], required: true }
    },
    funding: {
      model: { type: String, enum: ["presale", "treasury-backed"], required: true },
      softCap: { type: Number },
      hardCap: { type: mongoose.Schema.Types.Mixed },
      raisedAmount: { type: Number, required: true },
      fundingGoals: {
        lpPool: { type: Number },
        treasuryReserve: { type: Number },
        kolCampaign: { type: Number },
        aiAgent: { type: Number }
      },
      unlockModel: {
        dynamicUnlock: { type: Boolean },
        endsEarlyOnHardCap: { type: Boolean }
      }
    },
    tokenomics: {
      allocations: { type: mongoose.Schema.Types.Mixed, required: true }
    },
    airdropModules: {
      dropScore: { type: Boolean },
      gte: { type: Boolean },
      gta: { type: Boolean }
    },
    voting: {
      votingPeriodDays: { type: Number, required: true },
      quorumType: { type: String, enum: ["investment-based", "quorum-51%"], required: true },
      eligibleUnit: { type: String, required: true },
      totalVotes: { type: Number, required: true },
      passed: { type: Boolean, required: true }
    },
    launchMeta: {
      deployedBy: { type: String, required: true },
      txHash: { type: String, required: true },
      blockNumber: { type: Number }
    },
    created_at: { type: Number }
  },
  { collection: "token", strict: false }
);

const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
