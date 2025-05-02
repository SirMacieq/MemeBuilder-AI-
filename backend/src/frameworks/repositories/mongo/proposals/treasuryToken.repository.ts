import { crudMongoCreator } from "../crudMongoCreator"
import { TreasuryTokenDtoQuery, TreasuryTokenQuery } from "../../../../types/proposals/treasuryToken-types"
import TreasuryTokenModel from "../../../database/mongo/schemas/treasuryToken.schema"
import { treasuryTokenTypeFormatter } from "../../../common/adapter/proposals/treasuryTokenAdapter"

export default {
    ...crudMongoCreator<TreasuryTokenDtoQuery, TreasuryTokenQuery>({
        entityModel: TreasuryTokenModel,
        entityTypeFormatter: treasuryTokenTypeFormatter,
    })
};
