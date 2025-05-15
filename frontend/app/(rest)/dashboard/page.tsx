import Proposals from "@/components/organisms/dashboard/Proposals";
import Success from "@/components/organisms/dashboard/Success";
import { fundedTokenGetAll } from "@/lib/api/proposals/funded-token";

const Dashboard = async () => {
  const proposals = await fundedTokenGetAll();

  return (
    <div className="w-full grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
      <Success />
      <Proposals proposals={proposals.content.fundedTokens} />
    </div>
  );
};

export default Dashboard;
