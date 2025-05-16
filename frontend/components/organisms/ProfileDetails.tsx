"use client";
import React from "react";
import useUser from "@/store/sliceHooks/useUser";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import useFundedProposals from "@/store/sliceHooks/useFundedProposals";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import PubKeyDisplay from "../atoms/PubKeyDisplay";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ContributionDetails from "./ContributionDetails";
import { type OnChainProposalBase } from "@/lib/net-api/chain";

const ProfileDetails = () => {
  const [contrubutionToPopup, setContributionToPopup] =
    React.useState<OnChainProposalBase | null>(null);
  const { user } = useUser();
  const { proposals } = useFundedProposals();
  const wallet = useAnchorWallet();
  if (user === null)
    return (
      <div>
        User not already created on chain, it will be created on your first
        contribution
      </div>
    );
  if (!wallet) return;

  const submittedProposalsCount = proposals.reduce((acc, cur) => {
    if (cur.owner.toBase58() === wallet.publicKey.toBase58()) return acc + 1;
    else return acc;
  }, 0);
  const proposalContributed = proposals.filter((el) =>
    user.votes.map((el) => el.toBase58()).includes(el.id),
  );

  return (
    <Card className="m-2">
      <CardHeader className="text-xl font-bold flex flex-row">
        Connected Wallet <PubKeyDisplay pubkey={wallet.publicKey.toBase58()} />
      </CardHeader>
      <CardContent>
        {contrubutionToPopup && (
          <Dialog open={true} onOpenChange={() => setContributionToPopup(null)}>
            <DialogTitle>Contribution Details</DialogTitle>
            <DialogContent>
              <ContributionDetails proposal={contrubutionToPopup} />
            </DialogContent>
          </Dialog>
        )}
        <div className="grid grid-cols-2">
          <div>Submitted Proposals</div>
          <div className="text-right">{submittedProposalsCount}</div>
          <div>Voted Proposals</div>
          <div className="text-right">{user.votes.length}</div>
        </div>
        <h3 className="text-lg font-semibold my-2">Contributions</h3>
        <table className="w-full">
          <tbody>
            {proposalContributed.map((proposal) => (
              <tr
                key={proposal.id}
                onClick={() => setContributionToPopup(proposal)}
                className="cursor-pointer hover:bg-accent"
              >
                <td>{proposal.token.symbol}</td>
                <td className="text-right">{proposal.token.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
