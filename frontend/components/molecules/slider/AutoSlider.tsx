// components/AutoSlider.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";

interface AutoSliderProps {
  images: string[];
  reverse?: boolean;
  speed?: number; // en secondes
}

export default function AutoSlider({ images, reverse = false, speed = 50 }: AutoSliderProps) {
  const controls = useAnimation();

  useEffect(() => {
    const animate = () => {
      controls.start({
        x: reverse ? "0%" : "-50%",
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: speed,
          },
        },
      });
    };
    animate();
  }, [controls, reverse, speed]);

  return (
    <div className="overflow-hidden w-full pb-[5px]">
      <motion.div
        className="flex w-max"
        animate={controls}
        initial={{ x: reverse ? "-50%" : "0%" }}
      >
        {[...images, ...images].map((img, idx) => (
          <div key={idx} className="min-w-[200px] mx-2">
            <Image
              src={img}
              alt={`slider-${idx}`}
              width={500}
              height={416}
              className="rounded-xl"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
