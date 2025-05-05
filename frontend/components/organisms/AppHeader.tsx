import AppNav from "../molecules/AppNav";
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import Image from "next/image";
import { Search } from "lucide-react";

const AppHeader = async () => {
  let user = null;
  try {
    user = await getCurrentUserData();
  } catch {}
  
  return (
    <header className="p-4 lg:p-6 bg-[#081028] flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 w-full lg:w-auto">
        <div className="flex justify-between items-center w-full lg:w-auto">
          <Image src="/images/logo.svg" alt="Logo" width={60} height={60} />
          <div className="lg:hidden">
            <AppNav />
          </div>
        </div>

        {(user && user.nickname !== null) && (
          <div className="relative w-full lg:w-[466px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-[10px] pl-12 pr-6 bg-[#0B1739] rounded-full border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#7912FF]"
            />
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <AppNav />
      </div>
    </header>
  );
};

export default AppHeader;
