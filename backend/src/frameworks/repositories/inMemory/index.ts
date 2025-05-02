import user from "./user"
import fundedToken from "./proposals/fundedToken"
import treasuryToken from "./proposals/treasuryToken"
import daoGovernance from "./proposals/daoGovernance"

export default {
    ...user,
    ...fundedToken,
    ...treasuryToken,
    ...daoGovernance
}