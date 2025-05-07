"use server";
import { userUpdateById } from "@/lib/api/user/user";
import { revalidatePath } from "next/cache";
import z from "zod";

export default async function updateProfile(fd: FormData) {
  const bio = z.string().parse(fd.get("bio"));
  const nickname = z
    .string()
    .min(3, "Nickname is required")
    .parse(fd.get("nickname"));
  const userId = z.string().parse(fd.get("user_id"));
  const avatar = z.string().optional().parse(fd.get("avatar"));

  await userUpdateById(
    {
      bio: bio,
      nickname: nickname,
      avatar: avatar,
    },
    userId,
  );

  revalidatePath("/profile");
}
