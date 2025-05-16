import { endTokenProposal } from "./endTokenProposal";

export const botFundedToken = async (dependencies: any) => {
  const fundedTokenRepository = dependencies.repositories["fundedTokenRepository"];
  const tokenRepository = dependencies.repositories["tokenRepository"];

  const getAllProposals = await fundedTokenRepository.getAll();
  const getAllTokens = await tokenRepository.getAll();
  const now = new Date();

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() - 5);
  targetDate.setHours(0, 0, 0, 0);

  const startOfDay = targetDate.getTime();

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  const endOfDayMs = endOfDay.getTime();

  const proposalsAt5Days = getAllProposals.filter((proposal: any) => {
    const createdAtMs = proposal.created_at;
    return createdAtMs >= startOfDay && createdAtMs <= endOfDayMs;
  });

  const usedProposalIds = new Set(getAllTokens.map((token: any) => token.proposal_id));

  const filteredProposals = proposalsAt5Days.filter((proposal: any) => {
    return !usedProposalIds.has(proposal.id);
  });
  console.log("Proposals expirant aujourd'hui (5 jours) et sans token associé :", filteredProposals);
  for (const proposal of filteredProposals) {
    try {
      const result = await endTokenProposal(proposal);
      if (result.success) {
        console.log(`Success: ${result.proposalId}, token: ${result.tokenId}`);
        //ajout du token dans le backend (avec toutes les infos nécéssaires) await tokenRepository.add({infos du token});
        
      } else {
        console.error(`Error: ${result.proposalId}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error calling endTokenProposal for proposal ID ${proposal.id}:`, error);
    }
  }
  

  
};
