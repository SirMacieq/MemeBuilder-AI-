"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DeleteAccountButton from "@/components/atoms/DeleteAccountButton";
import updateProfile from "@/lib/actions/user/updateProfile";

export default function ProfileForm({ user }: { user: any }) {
  const [bio, setBio] = useState<string>(user.bio ?? "");
  const maxLength = 180;

  return (
    <form
      className="bg-[#0e131f] p-2 flex flex-col border border-white/5 rounded-[12px] p-[24px]"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        updateProfile(formData)
      }}
    >
      <h2 className="font-inter font-bold text-[24px] md:text-[32px] text-white mb-[32px]">
        Type your on-chain alter ego
      </h2>

      <label className="flex flex-col text-white gap-[8px] mb-[16px] font-medium">
        Nickname
        <Input
          className="w-full bg-[#151925] border border-white/5 p-[24px] rounded-[12px] placeholder:text-white placeholder:text-opacity-5"
          type="text"
          placeholder="e.g. Not Elon Musk"
          name="nickname"
          required
          defaultValue={user.nickname ?? ""}
        />
      </label>

      <label className="flex flex-col text-white gap-[8px] mb-[16px] font-medium">
        Bio
        <Textarea
          className="w-full h-[120px] resize-none bg-[#151925] border border-white/5 p-[16px] rounded-[12px] placeholder:text-white placeholder:text-opacity-50 text-white break-words break-all whitespace-pre-wrap overflow-auto"
          placeholder="Drop your bio..."
          name="bio"
          value={bio}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) setBio(e.target.value);
          }}
        />
        <div className="text-right text-[#909090] mt-2">
            {bio.length}/{maxLength}
        </div>
      </label>

      <input type="hidden" value={user._id} name="user_id" />
      <Button
        type="submit"
        className="w-full text-white font-semibold p-[24px] rounded-[12px] mt-[16px] mb-[8px]"
        style={{
          background: "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)"
        }}
      >
        Almost apead
      </Button>
      {user.nickname !== null && <DeleteAccountButton />}
    </form>
  );
}
