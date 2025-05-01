import { DaoGovernanceDtoQuery } from "../../../types/proposals/daoGovernance-types";
import { crudUseCase } from "../../crudUseCaseCreator";

export default {
  ...crudUseCase<DaoGovernanceDtoQuery, DaoGovernanceDtoQuery>({
    repositoryName: "daoGovernanceRepository",
    useCaseName: "daoGovernance",
  }),
};
