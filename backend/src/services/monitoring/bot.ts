export const botFundedToken = async (dependencies: any) => {
    const repository = dependencies.repositories["fundedTokenRepository"];
  console.log(dependencies.repositories)

    const getAllProposals = await repository.getAll();
  
    const now = Date.now();
    
    const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
  
    const filteredProposals = getAllProposals.filter((proposal: any) => {

  
      const createdAtMs = proposal.created_at; 
   // console.log(proposal)
      return (createdAtMs + fiveDaysMs) < now;
    });
  
    console.log("Proposals filtrées (created_at + 5 jours < now) :", filteredProposals);
  
  };
  