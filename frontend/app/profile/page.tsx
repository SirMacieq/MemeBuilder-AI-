import getCurrentUserData from "@/lib/actions/user/getCurrentUserData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Page = async () => {
  const user = await getCurrentUserData();
  console.log(user);
  return (
    <div className="grow flex justify-center items-center">
      <form className="bg-neutral-300 p-2 flex flex-col">
        <h2> Type your on-chain alter ego</h2>
        <label className="flex flex-col">
          Nickname
          <Input type="text" placeholder="e.g. Not Elon Musk" />
        </label>
        <label className="flex flex-col">
          Bio
          <Textarea placeholder="Drop your bio..."></Textarea>
        </label>
      </form>
    </div>
  );
};
export default Page;
