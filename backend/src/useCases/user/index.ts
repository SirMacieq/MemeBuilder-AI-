import { crudUseCase } from "../crudUseCaseCreator";
import { UserDtoQuery } from "../../types/user/user-types";
import signinUserUseCase from "./signinUser.useCase";

export default {
  ...crudUseCase<UserDtoQuery, UserDtoQuery>({
    repositoryName: "userRepository",
    useCaseName: "user",
  }),
  signinUserUseCase
};
