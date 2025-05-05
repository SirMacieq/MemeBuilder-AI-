import AppNav from "./AppNav";
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";

const AppHeader = async () => {
  let user = null;
  try {
    user = await getCurrentUserData();
  } catch {}
  return (
    <header className="h-20 bg-neutral-200 flex flex-row justify-between items-center">
      {user ? (
        <div className="pl-4">
          {user.nickname ?? "Unknown memelover"}- {user.wallet}
        </div>
      ) : (
        <div className="pl-4">AppHeader</div>
      )}
      <AppNav />
    </header>
  );
};
export default AppHeader;
