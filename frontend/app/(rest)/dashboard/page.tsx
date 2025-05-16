import Proposals from "@/components/organisms/dashboard/Proposals";
import Success from "@/components/organisms/dashboard/Success";
const Dashboard = async () => {
  return (
    <div className="w-full grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
      <Success />
      <Proposals />
    </div>
  );
};

export default Dashboard;
