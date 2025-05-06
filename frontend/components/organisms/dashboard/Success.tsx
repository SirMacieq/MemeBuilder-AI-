import Image from "next/image";
import {
  Banknote,
  Coins,
  LineChart,
  Percent,
  Trophy,
  User,
} from "lucide-react";

const fakeSuccess = {
  treasuryTokenBalance: 1200,
  totalTokens: 1537,
  members: 8420,
  fundsRaised: 4.2,
  avgROI: 312,
  topToken: "$SHIBA420",
  votingRate: 68,
};

const Success = () => {
  return (
    <section className="text-white w-full px-0">
      <h1 className="w-full bg-[#151925] flex items-center justify-center text-white p-[24px] font-semibold rounded-[12px] mb-4">
        DAO Treasury Balance
        <Image
          src="/images/sol.svg"
          alt="Logo"
          width={16}
          height={16}
          className="mx-2"
        />
        <span className="text-[#49DE80]">
          {fakeSuccess.treasuryTokenBalance} SOL
        </span>
      </h1>

      <div className="grid grid-cols-1 grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <Banknote className="w-5 h-5" />
            Total Tokens
          </p>
          <p className="text-white text-[28px] font-semibold">
            {fakeSuccess.totalTokens}
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <User className="w-5 h-5" />
            Members
          </p>
          <p className="text-white text-[28px] font-semibold">
            {fakeSuccess.members}
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <Coins className="w-5 h-5" />
            Funds Raised
          </p>
          <p className="text-white text-[28px] font-semibold">
            ${fakeSuccess.fundsRaised}M
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <Percent className="w-5 h-5" />
            Avg ROI
          </p>
          <p className="text-white text-[28px] font-semibold">
            {fakeSuccess.avgROI}%
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <Trophy className="w-5 h-5" />
            Top Token
          </p>
          <p className="text-white text-[28px] font-semibold">
            {fakeSuccess.topToken}
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <LineChart className="w-5 h-5" />
            Voting %
          </p>
          <p className="text-white text-[28px] font-semibold">
            {fakeSuccess.votingRate}%
          </p>
        </div>
      </div>
    </section>
  );
};

export default Success;
