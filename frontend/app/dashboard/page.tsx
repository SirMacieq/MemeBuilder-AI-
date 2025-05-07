import Proposals from "@/components/organisms/dashboard/Proposals";
import Success from "@/components/organisms/dashboard/Success";
import TreasuryProposalForm from "@/components/molecules/forms/TreasuryProposalForm";

const Dashboard = () => {
  return (
    <div className="w-full grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
      <Success />
      <Proposals />
    </div>
  );
};

export default Dashboard;
