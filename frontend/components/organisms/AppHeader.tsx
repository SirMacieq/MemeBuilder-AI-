import AppNav from "../molecules/AppNav";
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import Image from "next/image";
import SearchBar from "../molecules/search/Searchbar";

const AppHeader = async () => {
  let user = null;
  try {
    user = await getCurrentUserData();
  } catch {}

  return (
    <header className="p-4 lg:p-6 bg-[#010613] flex flex-col gap-6 z-50">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 w-full">
          <div className="flex justify-between items-center w-full lg:w-auto">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
            <div className="lg:hidden">
              <AppNav />
            </div>
          </div>

          {user && <SearchBar />}
        </div>

        <div className="hidden lg:block">
          <AppNav />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
