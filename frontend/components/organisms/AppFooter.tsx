import Link from "next/link";
import Image from "next/image";

const AppFooter = () => {
  return (
    <footer className="bg-[#081028] flex items-center justify-between px-[32px] py-6">

      <div className="flex gap-6 text-white text-sm">
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" className="hover:underline">
          Terms of Service
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
          <Image src="/images/twitter.svg" alt="Twitter" width={20} height={20} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Image src="/images/insta.svg" alt="Discord" width={20} height={20} />
        </a>
        <a href="https://threads.com" target="_blank" rel="noopener noreferrer">
          <Image src="/images/threads.svg" alt="GitHub" width={20} height={20} />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <Image src="/images/discord.svg" alt="LinkedIn" width={20} height={20} />
        </a>
      </div>
    </footer>
  );
};

export default AppFooter;
