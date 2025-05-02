import Link from "next/link";
import { Button } from "./ui/button";
import LogoutButton from "./atoms/LogoutButton";
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";

const AppNav = async () => {
  let user = null;
  try {
    user = await getCurrentUserData();
  } catch {}
  return (
    <nav className="p-2 flex flex-row gap-2 items-center">
      {user && (
        <>
          <Button>
            <Link href="profile/">Profile</Link>
          </Button>
          <LogoutButton />
        </>
      )}
      {!user && (
        <>
          <Button>
            <Link href="login/">Login</Link>
          </Button>
        </>
      )}
    </nav>
  );
};

export default AppNav;
