"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const HeaderHome = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center z-50">
      <motion.div
        className={`relative ${
          !isHovered ? "p-2 bg-black/50 backdrop-blur" : ""
        }-md rounded-full`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          className="bg-[#F4A653] text-black p-4 rounded-full shadow-lg transition-all duration-300"
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>

        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-0 flex space-x-4 bg-black/50 backdrop-blur-md p-6 rounded-[50px] z-10"
          initial={{ opacity: 0, scaleX: 0, transformOrigin: "center" }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scaleX: isHovered ? 1 : 0,
          }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{
            opacity: { duration: 0.3 },
            scaleX: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          <nav className="flex space-x-4 dm-mono-light">
            <a
              href="#welcome"
              onClick={(e) => handleScroll(e, "welcome")}
              className="text-white hover:text-[#F4A653] hover:underline transition"
            >
              Home
            </a>
            <a
              href="#story"
              onClick={(e) => handleScroll(e, "story")}
              className="text-white hover:text-[#F4A653] hover:underline transition"
            >
              Story
            </a>
            <a
              href="#benefits"
              onClick={(e) => handleScroll(e, "benefits")}
              className="text-white hover:text-[#F4A653] hover:underline transition"
            >
              Benefits
            </a>
            <a
              href="#roadmap"
              onClick={(e) => handleScroll(e, "roadmap")}
              className="text-white hover:text-[#F4A653] hover:underline transition"
            >
              Roadmap
            </a>
            <a
              href="#faq"
              onClick={(e) => handleScroll(e, "faq")}
              className="text-white hover:text-[#F4A653] hover:underline transition"
            >
              FAQ
            </a>
            <a
              href="#team"
              onClick={(e) => handleScroll(e, "team")}
              className="text-white hover:text-[#F4A653] hover:underline transition"
            >
              Team
            </a>
          </nav>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default HeaderHome;
