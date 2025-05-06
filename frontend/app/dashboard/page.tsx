import Proposals from "@/components/organisms/dashboard/Proposals";
import Success from "@/components/organisms/dashboard/Success";
import ProposalForm from "@/components/molecules/forms/ProposalForm";

const Dashboard = () => {
  return (
    <div className="grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
      <Success />
      <Proposals />
      <ProposalForm />
    </div>
  );
};

export default Dashboard;
