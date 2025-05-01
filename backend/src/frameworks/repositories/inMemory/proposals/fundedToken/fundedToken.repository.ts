
import { FundedTokenDtoQuery, FundedTokenQuery } from "../../../../../types/proposals/fundedToken-types";
import inMemoryDb from "../../../../database/inMemory";
import { crudInMemoryCreator } from "../../crudInMemoryCreator";

export default {
    ...crudInMemoryCreator<FundedTokenDtoQuery, FundedTokenQuery>({
        collectionName: "funded_token_proposals",
        inMemoryDb,
    })
};
