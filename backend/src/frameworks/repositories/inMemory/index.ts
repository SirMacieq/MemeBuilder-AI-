import user from "./user"
import fundedToken from "./proposals/fundedToken"
import treasuryToken from "./proposals/treasuryToken"
import daoGovernance from "./proposals/daoGovernance"
import token from "./token"

export default {
    ...user,
    ...fundedToken,
    ...treasuryToken,
    ...daoGovernance,
    ...token
}