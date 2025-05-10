"use server";
import {
  daoGovTokenCreate,
  type DaoGovTokenCreate,
} from "@/lib/api/proposals/dao-governance";
import { revalidatePath } from "next/cache";
import getCurrentUserData from "../../user/getCurrentUserData";

export default async function daoTokenCreateAction(
  data: Omit<DaoGovTokenCreate, "proposer_wallet" | "proposalType">,
) {
  const user = await getCurrentUserData();
  await daoGovTokenCreate({
    ...data,
    proposer_wallet: user.wallet,
    proposalType: "daoGovernance",
  });

  revalidatePath("/dashboard");
}
