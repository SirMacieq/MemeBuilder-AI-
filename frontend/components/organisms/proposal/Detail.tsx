"use client"
import Image from "next/image";
import { Rocket, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const Detail = ({ id }: { id: string | string[] | undefined }) => {
  const proposal = {
    id: 1,
    title: "Proposal 1",
    description: "Description of proposal 1",
    percentage: 60,
    voters: 1200,
    imgSrc: "images/memes/meme.svg",
    status: "Voting",
    tokenomics: {
        Team: 15,
        Community: 50,
        Investores: 20,
        Reserve: 15
    },
    narrative: "$DOGE99 is a community-first memecoin project on Solana with a humorous twist and real DeFi utility. Backed by a strong team and fair distribution."
  };

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
    await navigator.clipboard.writeText(content)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start grow bg-[#010613] px-[5%] gap-6">

<div className="w-full md:w-[49%] relative rounded-[12px] overflow-hidden bg-[#0e131f]">
      <Image
        src="/images/memes/meme-1.svg"
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
                    {proposal.title}
                    </h1>
                    <p className="text-sm text-[#BABABA]">
                    End in 3:12:27
                    </p>
                </div>
            </div>
            <p className="bg-[#FDA900] text-white flex center items-center p-[8px] text-[10px] md:text-[14px] rounded-[12px]"><Rocket className="mr-1"/>Proposal type</p>
        </div>
          
            <h2 className="font-semibold mb-[16px] text-[20px]">Raised: 33.5 SOL / 50 SOL (65%)</h2>
          <div className="flex w-full mb-[16px]">
            {[...Array(5)].map((_, index) => {
              const isFilled = proposal.percentage >= (index + 1) * 20;
              return (
                <div
                  key={index}
                  className={`w-1/5 h-2 rounded-lg ${
                    isFilled ? "bg-green-500" : "bg-white"
                  } ${index !== 4 ? "mr-1" : ""}`}
                />
              );
            })}
          </div>
          <div className="bg-[#151925] p-[24px] text-center rounded-[12px] mb-[24px]">
            <h3>You must stake an NFT or governance token to vote.</h3>
            <Button
                onClick={()=>{}}
                type="submit"
                className="w-full my-[24px] text-white font-semibold p-[24px] rounded-[12px] hidden md:flex"
                style={{
                    background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
                }}
                >
                Vote Now
                </Button>
            <p className="text-white/70 text-14px">Presale active – escrow confirmation required</p>
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
                {Object.entries(proposal.tokenomics).map(([key, value], index) => (
                <tr key={index} className="text-white/70 text-sm">
                    <td className="py-2 pl-4">{value}%</td>
                    <td className="py-2">{key}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">Budget Breakdown</h2>
          <div className="flex justify-between">
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">Dev Fund: 20%</p>
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">Marketing: 30%</p>
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">Liquidity: 40%</p>
            <p className="w-[24%] bg-[#151925] p-[4px] text-center text-white/70">Ops: 10%</p>
          </div>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">Budget Breakdown</h2>
          <p className="text-white/70">5% of total supply will be distributed to early community members who vote and stake within the first 24h.</p>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">Narrative</h2>
          <p className="text-white/70">{proposal.narrative}</p>
        </article>
        <article className="mb-[24px]">
          <h2 className="text-[16px] font-semibold mb-[16px]">Suggested Tweet</h2>
          <p className="p-[16px] rounded-[12px] bg-[#151925] text-white/70">"Just voted for $DOGE99 🐶💥 65% raised and counting. Let’s get this to 100%! Presale ends in 3 hours. Stake and vote now — no rug, just doge. #Solana #crypto"</p>
        </article>
        <article>
          <h2 className="text-[16px] font-semibold mb-[16px]">Markdown / Copy</h2>
          <div className="relative bg-[#151925] text-white text-sm p-4 rounded-[12px] whitespace-pre-wrap">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 text-white hover:text-green-400"
                title="Copy to clipboard"
            >
                {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
            </button>
            {content}
            </div>
        </article>
      </section>
    </div>
  );
};

export default Detail;
