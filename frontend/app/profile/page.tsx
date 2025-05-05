// app/profile/page.tsx (Server Component)
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import ProfileForm from "@/components/organisms/ProfileForm"; // composant client

export default async function Page() {
  const user = await getCurrentUserData();

  return <div className="grow flex flex-col justify-center items-center bg-[#081028]">
    <ProfileForm user={user} />
  </div>;
}
