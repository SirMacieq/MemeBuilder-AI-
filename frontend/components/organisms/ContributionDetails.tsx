"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, useCallback } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import PubKeyDisplay from "../atoms/PubKeyDisplay";
import {
  getContributionPDA,
  getProgram,
  type OnChainProposalBase,
} from "@/lib/net-api/chain";

const ContributionDetails = ({
  proposal,
}: {
  proposal: OnChainProposalBase;
}) => {
  const wallet = useAnchorWallet();
  const [contribution, setContribution] = useState<Awaited<
    ReturnType<typeof getContribution>
  > | null>();

  const getContribution = useCallback(async () => {
    if (!wallet) return;
    const contributionPda = await getContributionPDA(
      wallet,
      new PublicKey(proposal.id),
    );
    const program = getProgram(wallet);
    const contr = await program.account.contribution.fetch(contributionPda);
    setContribution(contr);
    return contr;
  }, [wallet, proposal]);

  useEffect(() => {
    getContribution();
  }, [wallet, proposal, getContribution]);

  console.log("contribution", contribution);
  console.log("proposal", proposal);
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">ContributionDetails</h3>
      <table className="w-full">
        <tbody>
          <tr>
            <th className="text-left">Token name</th>
            <td>{proposal.token.name}</td>
          </tr>
          <tr>
            <th className="text-left">Token symbol</th>
            <td>{proposal.token.symbol}</td>
          </tr>
          <tr>
            <th className="text-left">Proposal status</th>
            <td>{proposal.status}</td>
          </tr>
          <tr>
            <th className="text-left">Amount contributed</th>
            <td>{contribution?.amount.toNumber() / LAMPORTS_PER_SOL} SOL</td>
          </tr>
          <tr>
            <th className="text-left">Total contrubutions count</th>
            <td>{proposal.contributionCount}</td>
          </tr>
          <tr>
            <th className="text-left py-1">Proposal Owner</th>
            <td>
              <PubKeyDisplay pubkey={proposal.owner.toBase58()} />
            </td>
          </tr>
          <tr>
            <th className="text-left py-1">Proposal Account</th>
            <td>
              <PubKeyDisplay pubkey={proposal.id} />
            </td>
          </tr>
          <tr>
            <th className="text-left">Contribution date</th>
            <td>
              {new Date(
                contribution?.createdAt.toNumber() * 1000,
              ).toLocaleString("en-US")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContributionDetails;
