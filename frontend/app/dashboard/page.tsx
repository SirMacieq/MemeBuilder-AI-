import React from "react";
import TreasuryBalance from "@/components/atoms/TreasuryBalance";
import ProposalsFeed from "@/components/organisms/ProposalsFeed";
import ProposalForm from "@/components/molecules/forms/ProposalForm";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <TreasuryBalance />
      <ProposalsFeed />
      <ProposalForm />
    </div>
  );
};

export default Dashboard;
