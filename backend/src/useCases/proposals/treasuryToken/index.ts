import { TreasuryTokenDtoQuery } from "../../../types/proposals/treasuryToken-types";
import { crudUseCase } from "../../crudUseCaseCreator";

export default {
  ...crudUseCase<TreasuryTokenDtoQuery, TreasuryTokenDtoQuery>({
    repositoryName: "treasuryTokenRepository",
    useCaseName: "treasuryToken",
  }),
};
