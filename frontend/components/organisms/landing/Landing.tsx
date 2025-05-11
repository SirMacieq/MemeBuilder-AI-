import { useEffect, useState } from "react";
import AutoSlider from "../../molecules/slider/AutoSlider"
import "./landing.css"
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
import { Climate_Crisis } from 'next/font/google'
import Image from "next/image";
import { Cross } from "lucide-react";

const images = [
    "/images/landing/meme-1.png",
    "/images/landing/meme-2.png",
    "/images/landing/meme-3.png",
    "/images/landing/meme-4.png"
];
const images2 = [
    "/images/landing/meme-5.png",
    "/images/landing/meme-6.png",
    "/images/landing/meme-7.png",
    "/images/landing/meme-8.png"
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
      "Token 2049 & Solana BP attending"
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
      "AI Agents framework option release"
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
      "Utility and Enhancements"
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
      "Financial Review"
    ],
    blur: true,
  },
];

const questions = [
  { question: "Why MEME NFT?", answer: "The NFTs meme meta has yet to heat up. In addition, NFTs provide an ideal gateway for community building, which is the main goal of the collection." },
  { question: "Why Solana?", answer: "Of all the chains, the market condition of NFTs on Solana is the best. The largest collections achieved its ATH in the current bull run which cannot be said about the other chains. On top of that, Solana has a very high adoption of new users and at the same time introduces a lot of tech innovations such as new standards for NFTs or buying them from the link on X." },
  { question: "Why SPL-404 instead of typical NFTs?", answer: "We are committed to going with the spirit of innovation and at the same time using the unused. There has not yet been a true MEME NFT built on this standard and at the same time it is an ideal adoption solution because you can be part of the Community by having a certain amount of tokens." },
  { question: "What’s MemeBuilder(ai) powered by DAO?", answer: `We want to create true "DAO Plays" where instead of investing in other projects and giving away the community's money to other projects, we want to keep those funds inside the community together with DAO building and launching own memcoins / meme ai agents and together earning on them. Win to win.`},
  { question: "What’s the End Goal?", answer: "To build the first fully decentralized NFT project run by a DAO. Although it will be centralized at the beginning, after the collection is deployed and both products are launched, we will transfer ownership and management of the project to the community. (We won’t abandon the project but will allow the community to decide our future role.)" }
];
const climateCrisis = Climate_Crisis({ subsets: ['latin'] })
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
    <div className="w-full grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
        <section className="max-w-[1400px] relative">
            <AutoSlider images={images} speed={75}/>
            <AutoSlider images={images2} reverse speed={75} />
            <h1 className={`${climateCrisis.className} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] p-6 md:p-[32px] text-[60px]/20 backdrop-blur-md bg-black/50 rounded-[222px] text-center`}>
              United Society of Memes
            </h1>

        </section>
        <section className="max-w-[1400px] w-full overflow-hidden">
          <div className="bg-[#F4A653] w-full">
          <motion.div
  className={`${climateCrisis.className} flex w-fit text-[#010613] text-[84px] font-semibold tracking-widest uppercase whitespace-nowrap`}
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
          <article className="description h-[947px] flex flex-col justify-center items-center">
                <div className="w-[700px] p-[75px] text-[16px]/6 backdrop-blur-md bg-black/50 rounded-[50px] text-center dm-mono-light">
                  <p className="mb-[32px]">The <span className="font-bold">United Society of Memes (USM)</span> is here to make <span className="font-bold">Solana NFTs great again</span> by uniting meme culture, cutting-edge technology, and a vision for community empowerment.<br/>
                    The whole collection fits within the MEME-NFT narrative, combining <span className="font-bold">Classic Memes</span>, PolitiFi, and <span className="font-bold">Celebrity Meta</span> with meticulously designed traits for each character.</p>
                  <p className="mb-[32px]">At USM, we’re creating more than just art; we’re building a DAO-driven <span className="font-bold">Memebuilder (AI)</span> with tools that empower NFT holders to create their own Memecoins with tailored AI Agents on X and share token allocations exclusively within the DAO.</p>
                  <p className="mb-[32px]">Together, we aim to build a community where equality, sustainability, and transparency are at the core of every decision.</p>
                  <p className=".dm-mono-regular font-bold">IN $USM WE TRUST!</p>
                </div>
          </article>
        </section>
        <section className="max-w-[1400px] flex wrap mb-8">
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
          <article className="bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)] w-full md:w-[60%] p-[80px] rounded-[12px] text-[#010613]">
            <h2 className={`${climateCrisis.className} text-[40px] mb-4`}>BENEFITS FOR HOLDERS</h2>
            <ul className="dm-mono-light">
              <li className="border-b border-[#010613] py-4">Exclusive Ownership – Own and trade your NFTs for tokens using the SPL-404 standard.</li>

              <li className="border-b border-[#010613] py-4">Product Benefits – Invest, vote, and receive allocations with Memebuilder (AI).</li>

              <li className="border-b border-[#010613] py-4">DAO Fund – Feel like a VC and decide how funds within the DAO reserve are allocated.</li>

              <li className="border-b border-[#010613] py-4">Governance – Make decisions on rule changes, product upgrades, and leadership elections.</li>
            </ul>
          </article>
        </section>
        <section className="w-full p-[100px] max-w-[1400px] border-2 border-[#F4A653] flex items-center justify-evenly rounded-[50px] mb-8">
          <div className="p-[100px] rounded-[50px] border-t border-b border-[#F4A653]">
              <h2 className={`${climateCrisis.className} text-[40px] text-[#F4A653] mb-4 blur-sm`}>9696</h2>
              <p>Characters</p>
            </div>
            <div className="p-[100px] rounded-[50px] border-t border-b border-[#F4A653]">

            <h2 className={`${climateCrisis.className} text-[40px] text-[#F4A653] mb-4`}>100+</h2>
              <p>Traits</p>
            </div>
            <div className="p-[100px] rounded-[50px] border-t border-b border-[#F4A653]">

              <h2 className={`${climateCrisis.className} text-[40px] text-[#F4A653] mb-4 blur-sm`}>0.269</h2>
              <p>Minting Price (SOL)</p>
            </div>
          
        </section>

        <section className="max-w-[1400px] flex wrap mb-8">
          <Carousel
        className="w-full rounded-[50px]"
        opts={{ loop: false }}
        setApi={setApi2}
      >
        <CarouselContent>
          <CarouselItem className="basis-1/4 flex justify-center items-center">
            <div className="w-[480px] h-[300px] m-0 transform rotate-[-90deg] bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)] p-[80px] rounded-[50px]">
              <h2 className={`${climateCrisis.className} text-[40px]/34 text-[#010613] text-center`}>Roadmap</h2>
            </div>
          </CarouselItem>

          {phases.map((phase, idx) => (
            <CarouselItem key={idx} className="basis-1/2 p-0">
              <div
                className={`w-[690px] h-[480px] bg-[linear-gradient(to_bottom,_#F4A653,_#FFF1E0)] ${phase.blur ? "backdrop-blur-sm" : ""} p-[80px] rounded-[50px] text-[#010613]`}
              >
                <h2 className={`${climateCrisis.className} text-[24px] text-[#010613] mb-6`}>{phase.title}</h2>
                <ul className="list-disc pl-5 dm-mono-light">
                  {phase.list.map((item, index) => (
                    <li key={index} className="mb-3">{item}</li>
                  ))}
                </ul>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
        </section>
        <section className="w-full max-w-[1400px] mb-8">
          <h2 className={`${climateCrisis.className} text-[#F4A653] text-[40px] mb-8`}>GOT QUESTIONS?</h2>
        <div className="w-full mx-auto dm-mono-light">
          {questions.map((item, index) => (
            <div key={index} className="border-b border-[#F4A653]">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left p-[20px] text-lg font-semibold text-white focus:outline-none flex"
              >
                <Cross className="w-5 h-5" />
                {item.question}
              </button>
              {openIndex === index && (
                <div className="py-4 px-6 text-base">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        </section>
    </div>
  )
}

export default Landing