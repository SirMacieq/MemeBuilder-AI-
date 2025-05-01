import userUseCase from "./user";
import fundedTokenUseCase from "./proposals/fundedToken";
import treasuryTokenUseCase from "./proposals/treasuryToken";
import daoGovernanceUseCase from "./proposals/daoGovernance";

export default {
  ...userUseCase,
  ...fundedTokenUseCase,
  ...treasuryTokenUseCase,
  ...daoGovernanceUseCase,
};
