
import inMemoryDb from "../../../database/inMemory";
import { TokenDtoQuery, TokenQuery } from "../../../../types/token/token-types";
import { crudInMemoryCreator } from "../crudInMemoryCreator";

export default {
    ...crudInMemoryCreator<TokenDtoQuery, TokenQuery>({
        collectionName: "token",
        inMemoryDb,
    })
};
