"use client";
import FractionProgress from "@/components/atoms/FractionProgress";
import ProposalTypeBadge from "@/components/atoms/ProposalTypeBadge";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const ProposalCard = ({ proposal }: { proposal: any }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
  useEffect(() => {
    (async () => {
      const res = await fetch(proposal.imgSrc);
      const json = await res.json();
      setImageUrl(json.image);
    })();
  }, [proposal.imgSrc]);
  return (
    <div
      key={proposal.id}
      className="bg-[#151925] rounded-[12px] shadow-lg flex flex-col items-start"
    >
      <div
        className="h-[200px] w-full rounded-tl-[12px] rounded-tr-[12px] rounded-bl-none rounded-br-none overflow-clip flex flex-col justify-center"
        style={{
          background: generateRandomGradient(),
        }}
        suppressHydrationWarning
      >
        <Image
          src={!imageUrl ? "/images/memes/meme-1.svg" : imageUrl}
          alt="Avatar voters"
          width={300}
          height={200}
          className="h-full w-full object-center object-cover"
          priority={true}
        />
      </div>
      <div className="w-full p-[24px]">
        <h3 className="flex flex-row justify-between items-center">
          <Link
            href={`proposal/${proposal.id}`}
            className="text-[20px] uppercase font-semibold text-white mb-[8px]"
          >
            {proposal.title}
          </Link>
          <ProposalTypeBadge type="funded" variant="small" />
        </h3>
        <p className="text-sm text-[#BABABA] mb-[16px]">
          {proposal.description}
        </p>

        <div className="flex w-full mb-[16px]">
          <FractionProgress
            current={proposal.raisedAmount}
            target={proposal.totalGoal}
            fractions={5}
          />
        </div>

        <div className="flex items-center">
          <Image
            src="/images/voters.png"
            alt="Avatar voters"
            width={54}
            height={33}
            className="h-auto w-auto mr-2"
          />
          <div>
            <p className="text-white">{proposal.voters}</p>
            <p className="text-sm text-[#BABABA]">participants</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
