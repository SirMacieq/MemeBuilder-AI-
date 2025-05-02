import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import updateProfile from "@/lib/actions/user/updateProfile";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const user = await getCurrentUserData();
  return (
    <div className="grow flex justify-center items-center">
      <form className="bg-neutral-300 p-2 flex flex-col" action={updateProfile}>
        <h2>Type your on-chain alter ego</h2>
        <label className="flex flex-col">
          Nickname
          <Input
            type="text"
            placeholder="e.g. Not Elon Musk"
            name="nickname"
            required
            defaultValue={user.nickname ?? undefined}
          />
        </label>
        <label className="flex flex-col">
          Bio
          <Textarea
            placeholder="Drop your bio..."
            name="bio"
            defaultValue={user.bio ?? undefined}
          ></Textarea>
        </label>
        <input type="hidden" value={user._id} name="user_id" />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};
export default Page;
