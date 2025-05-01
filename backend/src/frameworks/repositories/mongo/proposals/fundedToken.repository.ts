import { crudMongoCreator } from "../crudMongoCreator";
import { fundedTokenTypeFormatter } from "../../../common/adapter/proposals/fundedTokenAdapter";
import { FundedTokenDtoQuery, FundedTokenQuery } from "../../../../types/proposals/fundedToken-types";
import FundedTokenModel from "../../../database/mongo/schemas/fundedToken.schema";

export default {
    ...crudMongoCreator<FundedTokenDtoQuery, FundedTokenQuery>({
        entityModel: FundedTokenModel,
        entityTypeFormatter: fundedTokenTypeFormatter,
    })
};
