import { Button } from "@/components/ui/button";
import Link from "next/link";

const Proposals = () => {
  return (
    <section className="w-full grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
        <h1 className="text-[32px]">Choose your proposal</h1>
        <div className="mt-[32px]">
            <Button
            asChild
            type="submit"
            className="w-[417px] mb-8 text-white font-semibold p-[24px] rounded-[12px] hidden md:flex"
            style={{
              background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
            }}
            >
                <Link href="proposals/token" className="text-white">Create your memecoin</Link>
            </Button>
            <Button
            asChild
            type="submit"
            className="w-[417px] mb-8 text-white font-semibold p-[24px] rounded-[12px] hidden md:flex"
            style={{
              background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
            }}
            >
                <Link href="proposals/treasury" className="text-white">Submit treasury</Link>
            </Button>
            <Button
            asChild
            type="submit"
            className="w-[417px] text-white font-semibold p-[24px] rounded-[12px] hidden md:flex"
            style={{
              background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
            }}
            >
                <Link href="proposals/treasury" className="text-white">Global DAO governance</Link>
            </Button>
        </div>
    </section>
  );
};

export default Proposals;
