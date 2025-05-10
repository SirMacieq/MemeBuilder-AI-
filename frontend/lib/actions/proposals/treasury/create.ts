"use server";
import {
  treasuryTokenCreate,
  type TreasuryTokenCreate,
} from "@/lib/api/proposals/treasury-token";
import { revalidatePath } from "next/cache";
import getCurrentUserData from "../../user/getCurrentUserData";

export default async function fundedTokenCreateAction(
  data: Omit<TreasuryTokenCreate, "proposer_wallet" | "proposalType">,
) {
  const user = await getCurrentUserData();
  await treasuryTokenCreate({
    ...data,
    proposer_wallet: user.wallet,
    proposalType: "treasuryToken",
  });

  revalidatePath("/dashboard");
}
