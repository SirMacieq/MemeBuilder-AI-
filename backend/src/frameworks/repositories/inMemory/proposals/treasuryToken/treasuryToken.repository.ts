import inMemoryDb from "../../../../database/inMemory";
import { TreasuryTokenDtoQuery, TreasuryTokenQuery } from "../../../../../types/proposals/treasuryToken-types";
import { crudInMemoryCreator } from "../../crudInMemoryCreator";

export default {
    ...crudInMemoryCreator<TreasuryTokenDtoQuery, TreasuryTokenQuery>({
        collectionName: "treasury_token_proposals",
        inMemoryDb,
    })
};
