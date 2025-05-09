"use server";
import {
  fundedTokenCreate,
  type FundedTokenCreate,
} from "@/lib/api/proposals/funded-token";
import { revalidatePath } from "next/cache";
import getCurrentUserData from "../../user/getCurrentUserData";

export default async function fundedTokenCreateAction(
  data: Omit<FundedTokenCreate, "proposer_wallet">,
) {
  const user = await getCurrentUserData();
  await fundedTokenCreate({ ...data, proposer_wallet: user.wallet });

  revalidatePath("/dashboard");
}
