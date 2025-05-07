"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DeleteAccountButton from "@/components/atoms/DeleteAccountButton";
import updateProfile from "@/lib/actions/user/updateProfile";
import type { User } from "@/lib/api/user/user";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfileForm({ user }: { user: User }) {
  const [bio, setBio] = useState<string>(user.bio ?? "");
  const maxLength = 180;
  const [avatar, setAvatar] = useState<string>(
    user.avatar ?? `avatar${Math.floor(1 + Math.random() * 13)}.jpeg`,
  );

  return (
    <form
      className="bg-[#0e131f] p-2 flex flex-col border border-white/5 rounded-[12px] p-[24px]"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateProfile(formData);
      }}
    >
      <h2 className="font-inter font-bold text-[24px] md:text-[32px] text-white mb-[32px]">
        Type your on-chain alter ego
      </h2>
      <Avatar className="w-[120px] h-[120px] self-center mb-[16px] shadow-md">
        <AvatarImage
          src={`/images/avatars/${avatar}`}
          alt={user.nickname ?? ""}
        />
      </Avatar>
      <input type="hidden" value={avatar} name="avatar" />
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" className="mx-auto">
            Change Avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose your nicest profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row flex-nowrap overflow-x-scroll">
            {Array.from({ length: 13 }, (_, n) => n + 1).map((n) => (
              <DialogTrigger
                key={n}
                onClick={() => setAvatar(`avatar${n}.jpeg`)}
              >
                <Avatar className="w-[120px] h-[120px] shadow-md">
                  <AvatarImage
                    src={`/images/avatars/avatar${n}.jpeg`}
                    alt={user.nickname ?? ""}
                  />
                </Avatar>
              </DialogTrigger>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
          background:
            "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
        }}
      >
        Almost apead
      </Button>
      {user.nickname !== null && <DeleteAccountButton />}
    </form>
  );
}
