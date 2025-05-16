"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import useFundedProposals from "@/store/sliceHooks/useFundedProposals";
import { useWallet } from "@solana/wallet-adapter-react";
import ProposalCard from "@/components/molecules/proposals/ProposalCard";

const endpoint = "https://api.mainnet-beta.solana.com";
type RefinedProposal = {
  id: string;
  title: string;
  description: string;
  percentage: number;
  voters: number;
  imgSrc: string;
  status: string | "Voting" | "Passed" | "Failed";
  totalGoal: number;
  raisedAmount: number;
};
const Proposals = () => {
  const [filter, setFilter] = useState<string>("All");
  const { proposals: onChainProposals } = useFundedProposals();
  console.log("onChainProposals", onChainProposals);
  const walletProps = useWallet();
  const reducedOnChainProposals: typeof workingfakeProposals =
    onChainProposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.token.name,
      description: proposal.token.description,
      percentage: 22,
      totalGoal: proposal.hardCap.toNumber(),
      raisedAmount: proposal.amountContributed.toNumber(),
      voters: proposal.contributionCount,
      imgSrc: proposal.token.logoUrl,
      status: "Voting",
    }));

  const workingfakeProposals = [
    ...reducedOnChainProposals,
  ] as RefinedProposal[];
  const filteredProposals =
    filter === "All"
      ? workingfakeProposals
      : workingfakeProposals.filter(
          (proposal: (typeof workingfakeProposals)[1]) =>
            proposal.status === filter,
        );

  return (
    <section className="w-full pt-[32px]">
      <div className="md:hidden mb-[24px] bg-[#151925] p-[24px] rounded-[12px]">
        <h2 className="text-[24px] font-bold mb-4 text-white text-center">
          Launch it. Meme it. Moon it.
        </h2>
        <Button
          asChild
          type="submit"
          className="w-full text-white font-semibold p-[24px] rounded-[12px]"
          style={{
            background:
              "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
          }}
        >
          <Link href="proposals/">Submit your memecoin</Link>
        </Button>
      </div>
      <h2 className="text-[24px] font-bold mb-4 text-white">Proposals</h2>

      <div className="flex justify-between items-center mb-6">
        <nav>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "All"
                ? "bg-[#151925] text-white"
                : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Voting"
                ? "bg-[#151925] text-white"
                : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Voting")}
          >
            Voting
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Passed"
                ? "bg-[#151925] text-white"
                : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Passed")}
          >
            Passed
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Launched"
                ? "bg-[#151925] text-white"
                : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Launched")}
          >
            Launched
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Failed"
                ? "bg-[#151925] text-white"
                : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Failed")}
          >
            Failed
          </Button>
        </nav>
        <div className="flex justify-end md:max-w-[50%]">
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined") {
                import("@jup-ag/terminal").then((mod) => {
                  const init = mod.init;
                  //@ts-ignore
                  import("@jup-ag/terminal/css");
                  init({
                    enableWalletPassthrough: true,
                    passthroughWalletContextState: walletProps,
                    endpoint,
                    formProps: {
                      fixedOutputMint: true,
                      initialAmount: "0",
                      initialInputMint:
                        "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                      initialOutputMint:
                        "So11111111111111111111111111111111111111112",
                    },
                    containerStyles: {
                      maxHeight: "390px",
                      padding: 16,
                      boxShadow: "0 0 30px 10px #7912FF",
                    },
                  });
                });
              }
            }}
            type="submit"
            className="w-[417px] text-white font-semibold p-[24px] rounded-[12px] hidden md:flex mr-4"
            style={{
              background:
                "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
            }}
          >
            Swap token
          </Button>
          <Button
            asChild
            type="submit"
            className="w-[417px] text-white font-semibold p-[24px] rounded-[12px] hidden md:flex"
            style={{
              background:
                "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
            }}
          >
            <Link href="proposals/">Submit your memecoin</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[24px]">
        {filteredProposals.toReversed().map((proposal) => (
          <ProposalCard proposal={proposal} key={proposal.id} />
        ))}
      </div>
    </section>
  );
};

export default Proposals;
