import { crudMongoCreator } from "../crudMongoCreator"
import { daoGovernanceTypeFormatter } from "../../../common/adapter/proposals/daoGovernanceAdapter"
import { DaoGovernanceDtoQuery, DaoGovernanceQuery } from "../../../../types/proposals/daoGovernance-types"
import DaoGovernanceModel from "../../../database/mongo/schemas/daoGovernance.schema"

export default {
    ...crudMongoCreator<DaoGovernanceDtoQuery, DaoGovernanceQuery>({
        entityModel: DaoGovernanceModel,
        entityTypeFormatter: daoGovernanceTypeFormatter,
    })
};
