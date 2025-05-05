import { crudMongoCreator } from "../crudMongoCreator";
import { TokenDtoQuery, TokenQuery } from "../../../../types/token/token-types";
import TokenModel from "../../../database/mongo/schemas/token.schema";
import { tokenTypeFormatter } from "../../../common/adapter/token/tokenAdapter";

export default {
    ...crudMongoCreator<TokenDtoQuery, TokenQuery>({
        entityModel: TokenModel,
        entityTypeFormatter: tokenTypeFormatter,
    })
};
