"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Voters from "@/public/images/voters.png"

const fakeProposals = [
  {
    id: 1,
    title: "Proposal 1",
    description: "Description of proposal 1",
    percentage: 60,
    voters: 1200,
    imgSrc: "images/memes/meme.svg",
    status: "Voting",
  },
  {
    id: 2,
    title: "Proposal 2",
    description: "Description of proposal 2",
    percentage: 30,
    voters: 800,
    imgSrc: "images/memes/meme-1.svg",
    status: "Passed",
  },
  {
    id: 3,
    title: "Proposal 3",
    description: "Description of proposal 3",
    percentage: 85,
    voters: 1400,
    imgSrc: "images/memes/meme-2.svg",
    status: "Failed",
  },
  {
    id: 4,
    title: "Proposal 4",
    description: "Description of proposal 4",
    percentage: 50,
    voters: 1000,
    imgSrc: "images/memes/meme-3.svg",
    status: "Voting",
  },
  {
    id: 5,
    title: "Proposal 5",
    description: "Description of proposal 5",
    percentage: 75,
    voters: 1300,
    imgSrc: "images/memes/meme-4.svg",
    status: "Passed",
  },
  {
    id: 6,
    title: "Proposal 6",
    description: "Description of proposal 6",
    percentage: 45,
    voters: 950,
    imgSrc: "images/memes/meme-5.svg",
    status: "Failed",
  },
];

const Proposals = () => {
  const [filter, setFilter] = useState("All");

  const filteredProposals =
    filter === "All"
      ? fakeProposals
      : fakeProposals.filter((proposal) => proposal.status === filter);

    const generateRandomGradient = () => {
      const colors = [
        "rgba(255, 0, 0, 0.8)", // Red
        "rgba(0, 255, 0, 0.8)", // Green
        "rgba(0, 0, 255, 0.8)", // Blue
        "rgba(255, 255, 0, 0.8)", // Yellow
        "rgba(0, 255, 255, 0.8)", // Cyan
        "rgba(255, 165, 0, 0.8)", // Orange
        "rgba(128, 0, 128, 0.8)", // Purple
      ];
    
      const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
      const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    
      return `linear-gradient(to right, ${randomColor1}, ${randomColor2})`;
    };
  return (
    <section className="w-full pt-[32px]">
    <div className="md:hidden mb-[24px] bg-[#151925] p-[24px] rounded-[12px]">
        <h2 className="text-[24px] font-bold mb-4 text-white text-center">Launch it. Meme it. Moon it.</h2>
        <Button
          asChild
          type="submit"
          className="w-full text-white font-semibold p-[24px] rounded-[12px]"
          style={{
            background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
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
              filter === "All" ? "bg-[#151925] text-white" : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Voting" ? "bg-[#151925] text-white" : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Voting")}
          >
            Voting
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Passed" ? "bg-[#151925] text-white" : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Passed")}
          >
            Passed
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Launched" ? "bg-[#151925] text-white" : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Launched")}
          >
            Launched
          </Button>
          <Button
            variant="outline"
            className={`mr-2 bg-transparent text-[#FFFFFF]/70 border-none ${
              filter === "Failed" ? "bg-[#151925] text-white" : "hover:bg-[#151925] hover:text-white"
            }`}
            onClick={() => setFilter("Failed")}
          >
            Failed
          </Button>
        </nav>

        <Button
          asChild
          type="submit"
          className="w-[417px] text-white font-semibold p-[24px] rounded-[12px] hidden md:flex"
          style={{
            background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
          }}
        >
          <Link href="proposals/">Submit your memecoin</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[24px]">
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-[#151925] rounded-[12px] shadow-lg flex flex-col items-start"
          >
            <div
            className="w-full rounded-tl-[12px] rounded-tr-[12px] rounded-bl-none rounded-br-none"
            style={{
              background: generateRandomGradient(),
            }}
            >
            <Image
                src={proposal.imgSrc}
                alt="Avatar voters"
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-md"
                layout="responsive"
              />
            </div>
            <div className="w-full p-[24px]">
            <h3 className="text-[20px] uppercase font-semibold text-white mb-[8px]">{proposal.title}</h3>
            <p className="text-sm text-[#BABABA] mb-[16px]">{proposal.description}</p>

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

            <div className="flex items-center">
            <Image
                src={Voters}
                alt="Avatar voters"
                width={54}
                height={33}
                className="mr-2"
              />
                <div>
                <p className="text-white">
                    {proposal.voters}
                </p>
                <p className="text-sm text-[#BABABA]">participants</p>
                </div>
            </div>
          </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Proposals;
