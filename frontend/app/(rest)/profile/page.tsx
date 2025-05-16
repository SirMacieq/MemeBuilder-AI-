// app/profile/page.tsx (Server Component)
import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import ProfileForm from "@/components/organisms/ProfileForm"; // composant client
import ProfileDetails from "@/components/organisms/ProfileDetails";

export default async function Page() {
  const user = await getCurrentUserData();

  return (
    <div className="grow flex flex-col justify-center items-center bg-[#010613] px-[5%]">
      <ProfileForm user={user} />
      {user.nickname && <ProfileDetails />}
    </div>
  );
}
