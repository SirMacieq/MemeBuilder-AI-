import Link from "next/link";
import { Button } from "../ui/button";
import LogoutButton from "../atoms/LogoutButton";
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import Image from "next/image";
import { User, LayoutDashboard } from "lucide-react";

const AppNav = async () => {
  let user = null;
  try {
    user = await getCurrentUserData();
  } catch {}

  return (
    <nav className="p-2 flex flex-row gap-2 items-center">
      {user && (
        <>
          {user.nickname !== null && (
            <Button
              asChild
              className="text-white border border-white/5 bg-transparent hover:bg-[#0B1739] p-3 rounded-full"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            </Button>
          )}

          {user.nickname !== null && (
            <Button
              asChild
              className="text-white border border-white/5 bg-transparent hover:bg-[#0B1739] p-3 rounded-full"
            >
              <Link href="/profile">
                <User className="w-5 h-5" />
              </Link>
            </Button>
          )}

          <LogoutButton />
        </>
      )}

      {!user && (
        <Button className="bg-none hover:bg-radial-[at_50%_50%] text-white border border-[#7912FF] bg-transparent hover:bg-[#0B1739] p-6 rounded-[24px]">
          <Link href="/login" className="flex items-center">
            <Image
              src="/images/wallet.png"
              alt=""
              width={16}
              height={16}
              className="mr-2"
            />
            Connect wallet
          </Link>
        </Button>
      )}
    </nav>
  );
};

export default AppNav;
