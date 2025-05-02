import { TokenDtoQuery } from "../../types/token/token-types";
import { crudUseCase } from "../crudUseCaseCreator";

export default {
  ...crudUseCase<TokenDtoQuery, TokenDtoQuery>({
    repositoryName: "tokenRepository",
    useCaseName: "token",
  }),
};
