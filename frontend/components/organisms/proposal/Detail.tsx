"use client";
import Image from "next/image";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Countdown from "@/components/atoms/Countdown";
import { useState, useEffect } from "react";
import { type OnChainProposal, getOneTokenProposal } from "@/lib/net-api/chain";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import FractionProgress from "@/components/atoms/FractionProgress";
import ProposalTypeBadge from "@/components/atoms/ProposalTypeBadge";
import VoteButton from "@/components/atoms/proposal/funded/VoteButton";
import { BN } from "@coral-xyz/anchor";

const LAMPORT_PEL_SOL = 1_000_000_000;

const Detail = ({ id }: { id: string | string[] | undefined }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const defaultProposal = {
    percentage: 60,
    status: "Voting",
    tokenomics: {
      Team: 15,
      Community: 50,
      Investores: 20,
      Reserve: 15,
    },
    narrative:
      "$DOGE99 is a community-first memecoin project on Solana with a humorous twist and real DeFi utility. Backed by a strong team and fair distribution.",
  };

  const [proposal, setProposal] = useState<
    typeof defaultProposal & OnChainProposal
  >();
  const wallet = useAnchorWallet();

  // console.log(
  //   "divided",
  //   proposal.amountContributed.toNumber() / LAMPORT_PEL_SOL,
  // );
  // console.log("not divided", proposal.amountContributed.toString());
  useEffect(() => {
    (async () => {
      if (!proposal) return;
      const res = await fetch(proposal.token.logoUrl);
      const json = await res.json();
      setImageUrl(json.image);
    })();
  }, [proposal, proposal?.token.logoUrl]);

  useEffect(() => {
    if (!id || !wallet) return;
    (async () => {
      const res = await getOneTokenProposal(wallet, id as string);
      console.log("res", res);
      setProposal({
        percentage: 20,
        status: "Voting",
        tokenomics: {
          Team: 15,
          Community: 50,
          Investores: 20,
          Reserve: 15,
        },
        narrative:
          "$DOGE99 is a community-first memecoin project on Solana with a humorous twist and real DeFi utility. Backed by a strong team and fair distribution.",
        ...res,
      });
    })();
  }, [id, wallet]);

  const content = `**$DOGE99 Presale is Live!**

Raised: 32.5 SOL / 50 SOL (65%)
Presale ends in 3h!

**Tokenomics:**
- Team: 15%
- Community: 50%
- Investors: 20%
- Reserve: 15%

**Budget:**
- Dev Fund: 20%
- Marketing: 30%
- Liquidity: 40%
- Ops: 10%

**Airdrop:** 5% of total supply to early stakers/voters.

Vote now & join the future of $DOGE99! 🐶🚀`;

  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!proposal) return;

  const totalFunds =
    proposal.fundingGoals.ai +
    proposal.fundingGoals.kol +
    proposal.fundingGoals.lp +
    proposal.fundingGoals.treasury;

  const percentages = {
    ai: (proposal.fundingGoals.ai / totalFunds) * 100,
    kol: (proposal.fundingGoals.kol / totalFunds) * 100,
    lp: (proposal.fundingGoals.lp / totalFunds) * 100,
    treasury: (proposal.fundingGoals.treasury / totalFunds) * 100,
  };
  return (
    <div className="flex flex-col md:flex-row justify-between items-start grow bg-[#010613] px-[5%] gap-6">
      <div className="w-full md:w-[49%] relative rounded-[12px] overflow-hidden bg-[#0e131f]">
        <Image
          src={imageUrl}
          alt="Meme"
          width={800}
          height={0}
          className="w-full h-auto rounded-[12px] object-cover"
        />
      </div>

      <section className="w-full md:w-[49%] rounded-[12px] bg-[#0e131f] p-[24px]">
        <div className="w-full ">
          <div className="flex justify-between items-start">
            <div className="flex justify-start items-center mb-[24px]">
              <Image
                src="/images/avatars/avatar1.jpeg"
                alt="Meme"
                width={52}
                height={52}
                className="rounded-[222px] mr-2 md:mr-4"
              />

              <div>
                <h1 className="text-[20px] uppercase font-semibold text-white mb-[4px]">
                  {proposal.token.name}
                </h1>
                <p className="text-sm text-[#BABABA]">
                  <Countdown
                    endDate={
                      new Date(
                        proposal.createdAt.setDate(
                          proposal.createdAt.getDate() +
                            proposal.voting.periodDays,
                        ),
                      )
                    }
                  />
                </p>
              </div>
            </div>
            <ProposalTypeBadge type="funded" />
          </div>

          <h2 className="font-semibold mb-[16px] text-[20px]">
            Raised: {proposal.amountContributed.toNumber() / LAMPORT_PEL_SOL}{" "}
            SOL / {proposal.hardCap.toNumber() / LAMPORT_PEL_SOL} SOL (
            {(proposal.amountContributed.toNumber() /
              proposal.hardCap.toNumber()) *
              100}
            %)
          </h2>
          <FractionProgress
            target={proposal.hardCap.toNumber()}
            current={proposal.amountContributed.toNumber()}
            fractions={5}
          />
          <div className="bg-[#151925] p-[24px] text-center rounded-[12px] mb-[24px]">
            <h3>You must stake an NFT or governance token to vote.</h3>
            <VoteButton proposal={proposal} />
            <p className="text-white/70 text-14px">
              Presale active – escrow confirmation required
            </p>
          </div>
        </div>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold">Tokenomics</h2>
          <table className="w-full text-left mt-[16px] border-collapse">
            <thead className="text-white text-sm bg-[#151925]">
              <tr>
                <th className="py-2 pl-4 w-[50%]">Allocation</th>
                <th className="py-2 w-[50%]">Category</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(proposal.tokenomics).map(
                ([key, value], index) => (
                  <tr key={index} className="text-white/70 text-sm">
                    <td className="py-2 pl-4">{value}%</td>
                    <td className="py-2">{key}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">
            Budget Breakdown
          </h2>
          <div className="flex justify-between">
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">
              Dev Fund: 20%
            </p>
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">
              Marketing: 30%
            </p>
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">
              Liquidity: 40%
            </p>
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">
              Ops: 10%
            </p>
          </div>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">
            Budget Breakdown
          </h2>
          <p className="text-white/70">
            5% of total supply will be distributed to early community members
            who vote and stake within the first 24h.
          </p>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">Narrative</h2>
          <p className="text-white/70">{proposal.narrative}</p>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">
            Suggested Tweet
          </h2>
          <p className="p-[16px] rounded-[12px] bg-[#151925] text-white/70">
            Just voted for $DOGE99 🐶💥 65% raised and counting. Let’s get this
            to 100%! Presale ends in 3 hours. Stake and vote now — no rug, just
            doge. #Solana #crypto
          </p>
        </article>
        <article>
          <h2 className="text-[16px] font-semibold mb-[16px]">
            Markdown / Copy
          </h2>
          <div className="relative bg-[#151925] text-white text-sm p-4 rounded-[12px] whitespace-pre-wrap">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-white hover:text-green-400"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Clipboard className="w-5 h-5" />
              )}
            </button>
            {content}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Detail;
