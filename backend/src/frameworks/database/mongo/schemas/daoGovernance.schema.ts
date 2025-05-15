import mongoose from "mongoose";

const daoGovernanceSchema = new mongoose.Schema(
  {
    proposal: {
      name: { type: String, required: true },
      description: { type: String, required: true },
      relatedLinks: [{ type: String, required: false }]
    },
    governanceGoals: {
      subDAO: { type: Boolean, required: true },
      fundsAllocation: { type: Number, required: true },
      otherActions: { type: Boolean, required: true }
    },
    governanceFunding: {
      subDAOCreation: { type: Number, required: false },
      generalReserve: { type: Number, required: false }
    },
    quorum: { type: Number, required: true },
    voting: {
      periodDays: { type: Number, required: true },
      voteUnit: { type: String, required: true }
    },
    proposal_id: { type: String, required: true },
    proposer_wallet: { type: String, required: true },
    created_at: { type: Number, required: false }
  },
  { collection: "dao_governance_proposals" }
);

const DaoGovernanceModel = mongoose.model("DaoGovernance", daoGovernanceSchema);

export default DaoGovernanceModel;
