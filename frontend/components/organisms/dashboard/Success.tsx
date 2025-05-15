"use client";
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

import { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as api from "@/lib/net-api/chain";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import Link from "next/link";

const Success = () => {
  const wallet = useAnchorWallet();
  const [users, setUsers] = useState<any[] | null>();
  const [proposals, setProposals] = useState<any[] | null>();

  useEffect(() => {
    if (!wallet) return;
    (async () => {
      const program = api.getProgram(wallet);
      const allUsers = await program.account.user.all();
      setUsers(allUsers);
      const allProposals = await program.account.tokenProposal.all();
      setProposals(allProposals);
    })();
  }, [wallet]);

  const totalRaised = proposals?.reduce((acc, cur) => {
    return acc + cur.account.amountContributed.toNumber() / LAMPORTS_PER_SOL;
  }, 0);

  const bestToken = proposals?.reduce(
    (acc, cur) => {
      return cur.account.amountContributed.toNumber() >
        acc.account.amountContributed.toNumber()
        ? cur
        : acc;
    },
    { account: { amountContributed: new BN(0) } },
  );

  return (
    <section className="text-white w-full px-0">
      <h1 className="w-full bg-[#151925] flex items-center justify-center text-white p-[24px] font-semibold rounded-[12px] mb-4">
        DAO Treasury Balance
        <Image
          src="/images/sol.svg"
          alt="Logo"
          width={16}
          height={16}
          className="h-auto w-auto mx-2"
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
            {proposals?.length}
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <User className="w-5 h-5" />
            Members
          </p>
          <p className="text-white text-[28px] font-semibold">
            {users?.length}
          </p>
        </div>

        <div className="bg-[#151925] p-4 rounded-[12px] shadow p-[24px]">
          <p className="flex items-center gap-2 text-[#FFFFFF]/70 mb-[16px]">
            <Coins className="w-5 h-5" />
            Funds Raised
          </p>
          <p className="text-white text-[28px] font-semibold">
            {totalRaised} SOL
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
            <Link href={`/proposal/${bestToken?.publicKey?.toBase58()}`}>
              {bestToken?.account?.token?.symbol}
            </Link>
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
