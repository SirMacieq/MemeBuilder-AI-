import mongoose from "mongoose";

const fundedTokenSchema = new mongoose.Schema(
  {
    token: {
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      description: { type: String, required: true },
      logoUrl: { type: String, required: true }
    },
    selectedGoals: {
      lp: { type: Boolean, required: true },
      treasury: { type: Boolean, required: true },
      kol: { type: Boolean, required: true },
      ai: { type: Boolean, required: true }
    },
    fundingGoals: {
      lp: { type: Number, required: true },
      treasury: { type: Number, required: true },
      kol: { type: Number, required: true },
      ai: { type: Number, required: true }
    },
    softCap: { type: Number, required: true },
    hardCap: { type: mongoose.Schema.Types.Mixed, required: true }, // number | "dynamic"
    fundingModel: {
      dynamicUnlock: { type: Boolean, required: true },
      endsEarlyOnHardCap: { type: Boolean, required: true }
    },
    airdropModules: {
      dropScore: { type: Boolean }
    },
    voting: {
      periodDays: { type: Number, required: true },
      voteUnit: { type: String, required: true },
      escrowedFunds: { type: Boolean, required: true }
    },
    proposal_id: { type: String, required: true },
    proposer_wallet: { type: String, required: true },
    created_at: { type: Number, required: false }
  },
  { collection: "funded_token_proposals" }
);

const FundedTokenModel = mongoose.model("FundedToken", fundedTokenSchema);

export default FundedTokenModel;
