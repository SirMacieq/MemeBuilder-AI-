import inMemoryDb from "../../../../database/inMemory"
import { crudInMemoryCreator } from "../../crudInMemoryCreator"
import { DaoGovernanceDtoQuery, DaoGovernanceQuery } from "../../../../../types/proposals/daoGovernance-types"

export default {
    ...crudInMemoryCreator<DaoGovernanceDtoQuery, DaoGovernanceQuery>({
        collectionName: "dao_governance_proposals",
        inMemoryDb,
    })
};
