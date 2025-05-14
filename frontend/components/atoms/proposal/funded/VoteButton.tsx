"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type OnChainProposal } from "@/lib/net-api/chain";
import { Input } from "@/components/ui/input";
import * as api from "@/lib/net-api/chain";
import { PublicKey } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const texts = {
  status: {
    userExistCheck: "Checking if the user Exists",
    userCreation: "Creating the user on chain",
    checkIfalreadyContributed:
      "Checking if you already contributed to the proposal",
    contribution: "Contribute to the proposal",
    success: "Vote successfully submitted",

    error: "Error in submitting vote",
    errorAlreadyVoted: "You have already voted for this proposal",
    errorAmountUnset: "Please enter the amount to be contributed",
  },
};

const VoteButton = ({ proposal }: { proposal: OnChainProposal }) => {
  const wallet = useAnchorWallet();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voteSubmitStatus, setVoteSubmitStatus] = useState<string | null>();
  /** Amount to vote in sol */
  const [amount, setAmount] = useState<number | "">("");
  const [contributionTx, setContributionTx] = useState<string | null>();

  const handleVote = async () => {
    if (!wallet) return;
    if (!amount) return setVoteSubmitStatus(texts.status.errorAmountUnset);

    try {
      const program = api.getProgram(wallet);
      setVoteSubmitStatus(texts.status.userExistCheck);
      const userPdaId = await api.getUserPDA(wallet);
      const userPdaData = await program.account.user.fetchNullable(userPdaId);

      if (!userPdaData) {
        setVoteSubmitStatus(texts.status.userCreation);
        await api.createUser(wallet, userPdaId);
      }

      setVoteSubmitStatus(texts.status.checkIfalreadyContributed);
      const contributionPdaId = await api.getContributionPDA(
        wallet,
        new PublicKey(proposal.id),
      );
      const contributionPdaData =
        await program.account.contribution.fetchNullable(contributionPdaId);
      if (contributionPdaData) {
        setVoteSubmitStatus(texts.status.errorAlreadyVoted);
        return;
      }

      const constributionTx = await api.contributeToProposal(
        wallet,
        proposal.id,
        new BN(amount * LAMPORTS_PER_SOL), //bn amount in lamports
        contributionPdaId,
        userPdaId,
      );

      setContributionTx(constributionTx.toString());
      setVoteSubmitStatus(texts.status.success);
      // TODO: refresh state of proposal
      //
    } catch (e) {
      console.log(e);
      setVoteSubmitStatus(texts.status.error);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full my-[24px] font-semibold p-[24px] md:flex"
          onClick={() => setIsDialogOpen(true)}
        >
          Vote Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vote for {proposal.token.name}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount to vote in SOL"
        />
        {voteSubmitStatus && (
          <div>
            <p>Status: {voteSubmitStatus}</p>
            {contributionTx && (
              <p className="text-wrap wrap-anywhere">
                Contribution transaction: Signature: {contributionTx}
                <br />
                <a
                  href={`https://explorer.solana.com/tx/${contributionTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Solana Explorer
                </a>
              </p>
            )}
          </div>
        )}
        <Button
          type="button"
          className="w-full mt-[24px] font-semibold p-[24px] md:flex"
          onClick={() => handleVote()}
        >
          Vote Now
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VoteButton;
