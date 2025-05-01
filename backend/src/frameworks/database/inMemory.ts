import { UserQuery } from "../../types/user/user-types"
import { FundedTokenQuery } from "../../types/proposals/fundedToken-types";
import { TreasuryTokenQuery } from "../../types/proposals/treasuryToken-types";
import { DaoGovernanceQuery } from "../../types/proposals/daoGovernance-types";

const database: {
    user: UserQuery[],
    funded_token_proposals: FundedTokenQuery[],
    treasury_token_proposals: TreasuryTokenQuery[],
    dao_governance_proposals: DaoGovernanceQuery[]

} = {
    user: [],
    funded_token_proposals: [],
    treasury_token_proposals: [],
    dao_governance_proposals: []
}

export default database;