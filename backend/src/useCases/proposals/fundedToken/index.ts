import { crudUseCase } from "../../crudUseCaseCreator";
import { FundedTokenDtoQuery } from "../../../types/proposals/fundedToken-types";

export default {
  ...crudUseCase<FundedTokenDtoQuery, FundedTokenDtoQuery>({
    repositoryName: "fundedTokenRepository",
    useCaseName: "fundedToken",
  }),
};
