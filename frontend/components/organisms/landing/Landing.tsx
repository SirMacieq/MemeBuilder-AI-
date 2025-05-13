import { useEffect, useState } from "react";
import AutoSlider from "../../molecules/slider/AutoSlider";
import "./landing.css";
import { motion, useAnimation } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { Climate_Crisis } from "next/font/google";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const images = [
  "/images/landing/meme-1.png",
  "/images/landing/meme-2.png",
  "/images/landing/meme-3.png",
  "/images/landing/meme-4.png",
];
const images2 = [
  "/images/landing/meme-5.png",
  "/images/landing/meme-6.png",
  "/images/landing/meme-7.png",
  "/images/landing/meme-8.png",
];

const phases = [
  {
    title: "H2 2024",
    list: [
      "Project set up",
      "Closing core team",
      "Creating a core strategy",
      "Website release",
      "Initial community engagement",
      "Token 2049 & Solana BP attending",
    ],
    blur: false,
  },
  {
    title: "H1 2025",
    list: [
      "NFT Paris activities",
      "USM Collection Mint",
      "Memebuilder (AI) launch",
      "Potus Agent TGE",
      "Partnerships with influencers",
      "AI Agents framework option release",
    ],
    blur: false,
  },
  {
    title: "Nft sale and post-launch",
    list: [
      "NFT Minting",
      "NFT Sale Event",
      "Secondary Market Engagement",
      "Feedback and Iteration",
      "Post-launch marketing campaigns",
      "Utility and Enhancements",
    ],
    blur: true,
  },
  {
    title: "Long-term growth and sustainability",
    list: [
      "Community Engagement",
      "New NFT Releases",
      "Various Partnershipis",
      "Continuous Marketing",
      "Sustainability initiatives",
      "Financial Review",
    ],
    blur: true,
  },
];

const questions = [
  {
    question: "Why MEME NFT?",
    answer:
      "The NFTs meme meta has yet to heat up. In addition, NFTs provide an ideal gateway for community building, which is the main goal of the collection.",
  },
  {
    question: "Why Solana?",
    answer:
      "Of all the chains, the market condition of NFTs on Solana is the best. The largest collections achieved its ATH in the current bull run which cannot be said about the other chains. On top of that, Solana has a very high adoption of new users and at the same time introduces a lot of tech innovations such as new standards for NFTs or buying them from the link on X.",
  },
  {
    question: "Why SPL-404 instead of typical NFTs?",
    answer:
      "We are committed to going with the spirit of innovation and at the same time using the unused. There has not yet been a true MEME NFT built on this standard and at the same time it is an ideal adoption solution because you can be part of the Community by having a certain amount of tokens.",
  },
  {
    question: "What’s MemeBuilder(ai) powered by DAO?",
    answer: `We want to create true "DAO Plays" where instead of investing in other projects and giving away the community's money to other projects, we want to keep those funds inside the community together with DAO building and launching own memcoins / meme ai agents and together earning on them. Win to win.`,
  },
  {
    question: "What’s the End Goal?",
    answer:
      "To build the first fully decentralized NFT project run by a DAO. Although it will be centralized at the beginning, after the collection is deployed and both products are launched, we will transfer ownership and management of the project to the community. (We won’t abandon the project but will allow the community to decide our future role.)",
  },
];

const team = [
  { name: "@Mad mac", position: "CEO", img: images[0] },
  { name: "@Kajto", position: "COO", img: images[1] },
  { name: "@Ziemowit", position: "Art director", img: images[3] },
  { name: "@Antek", position: "CTO", img: images[2] },
  { name: "@Edouard", position: "Software enginer", img: images2[1] },
  { name: "@Axel", position: "Frontend developer", img: images2[2] },
  { name: "@Kasper", position: "Product designer", img: images2[3] },
  { name: "@Aleksander", position: "UI/UX designer", img: images[0] },
  { name: "@Vincent", position: "Creative thinker", img: images[1] },
];
const climateCrisis = Climate_Crisis({ subsets: ["latin"] });
interface TextSliderProps {
  text: string;
  reverse?: boolean;
  speed?: number;
}

const Landing = () => {
  const controls = useAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [api2, setApi2] = useState<CarouselApi | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    controls.start({
      x: "-50%",
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: 40,
        },
      },
    });
  }, [controls]);

  useEffect(() => {
    if (!api) return;

    const autoplay = () => {
      if (!api.canScrollNext()) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    };

    intervalRef.current = setInterval(autoplay, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);
  return (
    <div className="w-full grow flex flex-col justify-center items-center bg-[#010613] md:px-[5%]" id="welcome">
      <section className="w-full max-w-[1400px] relative overflow-hidden">
        <AutoSlider images={images} speed={75} />
        <AutoSlider images={images2} reverse speed={75} />
        <h1
      className={`
        ${climateCrisis.className}
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[90%] md:w-full max-w-[800px]
        p-6 md:p-[32px]
        backdrop-blur-md bg-black/50 rounded-[222px]
        text-center flex flex-col items-center gap-6
      `}
    >
      <span className="text-[40px] leading-[1.2] md:text-[60px] text-white">
        United Society of Memes
      </span>
      
      <Button
        asChild
        type="submit"
        className="border border-white/5 bg-transparent hover:bg-[#0B1739] text-white text-[14px] md:text-[20px] p-[24px] rounded-full"
      >
        <Link href="/dashboard">Start the adventure</Link>
      </Button>
      </h1>
      </section>
      <section className="max-w-[1400px] w-full overflow-hidden">
        <div className="bg-[#F4A653] w-full">
          <motion.div
            className={`${climateCrisis.className} flex w-fit text-[#010613] text-[40px] md:text-[84px] font-semibold tracking-widest uppercase whitespace-nowrap`}
            animate={controls}
            initial={{ x: "0%" }}
          >
            {[...Array(2)].map((_, idx) => (
              <span key={idx} className="mr-12">
                About us . About us . About us .
              </span>
            ))}
          </motion.div>
        </div>
        <article className="description md:h-[947px] flex flex-col justify-center items-center px-4">
          <div className="w-[95%] md:w-full max-w-[700px] p-[32px] md:p-[75px] text-[16px]/[2] backdrop-blur-md bg-black/50 rounded-[30px] md:rounded-[50px] text-center dm-mono-light" id="story">
            <p className="mb-[24px]">
              The{" "}
              <span className="font-bold">United Society of Memes (USM)</span>{" "}
              is here to make{" "}
              <span className="font-bold">Solana NFTs great again</span> by
              uniting meme culture, cutting-edge technology, and a vision for
              community empowerment.
              <br />
              The whole collection fits within the MEME-NFT narrative, combining{" "}
              <span className="font-bold">Classic Memes</span>, PolitiFi, and{" "}
              <span className="font-bold">Celebrity Meta</span> with
              meticulously designed traits for each character.
            </p>
            <p className="mb-[24px]">
              At USM, we’re creating more than just art; we’re building a
              DAO-driven <span className="font-bold">Memebuilder (AI)</span>{" "}
              with tools that empower NFT holders to create their own Memecoins
              with tailored AI Agents on X and share token allocations
              exclusively within the DAO.
            </p>
            <p className="mb-[24px]">
              Together, we aim to build a community where equality,
              sustainability, and transparency are at the core of every
              decision.
            </p>
            <p className="dm-mono-regular font-bold">IN $USM WE TRUST!</p>
          </div>
        </article>
      </section>
      <section className="max-w-[1400px] flex flex-col md:flex-row wrap mb-8">
        <div className="w-full md:w-[40%]">
          <Carousel
            className="w-full rounded-[12px]"
            opts={{ loop: true }}
            setApi={setApi}
          >
            <CarouselContent>
              {images.map((src, idx) => (
                <CarouselItem key={idx} className="basis-full">
                  <img
                    src={src}
                    alt={`carousel-${idx}`}
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <article className="bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)] w-[90%] mt-8 md:mt-0 mx-auto md:w-[60%] p-[30px] md:p-[80px] rounded-[50px] text-[#010613]" id="benefits">
          <h2 className={`${climateCrisis.className} text-[40px] mb-4`}>
            BENEFITS FOR HOLDERS
          </h2>
          <ul className="dm-mono-light">
            {[
              "Exclusive Ownership – Own and trade your NFTs for tokens using the SPL-404 standard.",
              "Product Benefits – Invest, vote, and receive allocations with Memebuilder (AI).",
              "DAO Fund – Feel like a VC and decide how funds within the DAO reserve are allocated.",
              "Governance – Make decisions on rule changes, product upgrades, and leadership elections.",
            ].map((text, index) => (
              <li
                key={index}
                className="border-b border-[#010613] py-4 flex items-center gap-4"
              >
                <img
                  src="/images/sparkle.svg"
                  alt="icon"
                  className="w-5 h-5 mt-1"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="w-[90%] md:w-full px-[5%] md:px-0 py-[60px] md:py-[100px] max-w-[1400px] border-2 border-[#F4A653] flex flex-col md:flex-row items-center justify-evenly rounded-[50px] mb-8 gap-8 md:gap-0">
        {[
          { title: "9696", subtitle: "Characters", blur: true },
          { title: "100+", subtitle: "Traits", blur: false },
          { title: "0.269", subtitle: "Minting Price (SOL)", blur: true },
        ].map((item, index) => (
          <div
            key={index}
            className="w-full md:w-auto px-8 py-12 md:px-[100px] md:py-[100px] rounded-[50px] border-t border-b border-[#F4A653] text-center"
          >
            <h2
              className={`${
                climateCrisis.className
              } text-[32px] md:text-[40px] text-[#F4A653] mb-4 ${
                item.blur ? "blur-sm" : ""
              }`}
            >
              {item.title}
            </h2>
            <p>{item.subtitle}</p>
          </div>
        ))}
      </section>

      <section className="w-full max-w-[1400px] mx-auto mx-auto pl-[5%] md:pl-0 mb-8 overflow-hidden relative" id="roadmap">
  <Carousel className="w-full" opts={{ loop: false }} setApi={setApi2}>
    <CarouselContent className="flex">
      <CarouselItem className="w-[331px] sm:basis-full md:basis-1/2 lg:basis-1/4">
        <div className="w-[331px] h-[350px] md:h-[480px] bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)] flex items-center justify-center p-6 md:p-12 rounded-[50px]">
          <div className="rotate-270 origin-center w-max h-max">
            <h2
              className={`${climateCrisis.className} text-[24px] md:text-[40px] text-[#010613] text-center`}
            >
              Roadmap
            </h2>
          </div>
        </div>
      </CarouselItem>

      {phases.map((phase, idx) => (
        <CarouselItem
          key={idx}
          className="w-full sm:basis-full md:basis-1/2 lg:basis-1/3 px-2 relative"
        >
          <div
            className={`
              w-[94%] md:w-full h-[350px] md:h-[480px]
              bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)]
              p-12 rounded-[30px] md:rounded-[50px]
              text-[#010613] flex flex-col justify-start
            `}
          >
            <div className={`mb-2 ${phase.blur ? "blur-sm" : ""}`}>
          <h2 className={`${climateCrisis.className} text-[20px] md:text-[24px] mb-4`}>
            {phase.title}
          </h2>
          <ul className="list-disc pl-5 dm-mono-light text-[14px] md:text-[16px] overflow-y-auto">
            {phase.list.map((item, index) => (
              <li key={index} className="mb-3">
                {item}
              </li>
            ))}
          </ul>
          </div>
            <div
              className={`${climateCrisis.className} absolute bottom-[-58px] right-12
              text-[#0F0F0F]/15 bg-opacity-40 rounded-full p-2 text-center
              text-[150px] font-bold ${phase.blur ? "blur-sm" : ""}`}
            >
              {idx + 1}
            </div>
        </div>

        </CarouselItem>
      ))}
    </CarouselContent>

    {/* Positioning arrows absolutely */}
    <CarouselPrevious className="absolute top-1/2 left-[2px] -translate-y-1/2 z-10 bg-[#010613] text-[#F4A653] hover:bg-[#F4A653] hover:text-[#010613] transition-colors rounded-full w-10 h-10 flex items-center justify-center" />
    <CarouselNext className="absolute top-1/2 right-[38px] md:right-[12px] -translate-y-1/2 z-10 bg-[#010613] text-[#F4A653] hover:bg-[#F4A653] hover:text-[#010613] transition-colors rounded-full w-10 h-10 flex items-center justify-center" />
  </Carousel>
</section>

      <section className="w-[90%] md:w-full max-w-[1400px] mx-auto mb-8 border-2 border-[#F4A653] p-[30px] md:p-[100px] rounded-[50px]" id="faq">
  <h2
    className={`${climateCrisis.className} text-[#F4A653] text-[24px] md:text-[40px] mb-4 md:mb-8`}
  >
    GOT QUESTIONS?
  </h2>

  <div className="w-full dm-mono-light">
    {questions.map((item, index) => (
      <div key={index} className="border-b border-[#F4A653]">
        <button
          onClick={() => toggleAccordion(index)}
          className="w-full text-left py-[20px] flex items-start gap-4 text-lg font-semibold text-white focus:outline-none"
        >
          <motion.div
            animate={{ rotate: openIndex === index ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 text-[#F4A653] shrink-0"
          >
            <Plus className="w-6 h-6" />
          </motion.div>
          <span className="flex-1">{item.question}</span>
        </button>
        {openIndex === index && (
          <div className="pb-4 pl-10 text-base">
            <p>{item.answer}</p>
          </div>
        )}
      </div>
    ))}
  </div>
</section>

<section className="w-[90%] md:w-full max-w-[1400px] mx-auto mb-8 bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)] px-[5%] md:px-[100px] py-[40px] md:py-[100px] rounded-[50px] overflow-x-hidden" id="team">
  <motion.div
    className={`${climateCrisis.className} flex w-fit text-[#010613] text-[40px] md:text-[60px] font-semibold tracking-widest uppercase whitespace-nowrap`}
    animate={controls}
    initial={{ x: "0%" }}
  >
    {[...Array(2)].map((_, idx) => (
      <span key={idx} className="mr-12">
        Meet the team . Meet the team . Meet the team .
      </span>
    ))}
  </motion.div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 md:mt-12">
    {team.map((member, index) => (
      <div
        key={index}
        className="bg-[#010613] dm-mono-light p-4 rounded-[50px]"
      >
        <Image
          src={member.img}
          alt={`${member.name} avatar`}
          width={500}
          height={416}
          className="rounded-[50px] w-full h-auto"
        />
        <h3
          className={`${climateCrisis.className} text-[22px]/[34px] text-[#F4A653] text-center mt-4`}
        >
          {member.name}
        </h3>
        <p className="text-center">{member.position}</p>
      </div>
    ))}
  </div>
</section>

    </div>
  );
};

export default Landing;
