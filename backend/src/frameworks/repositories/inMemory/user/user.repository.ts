import { UserQuery, UserDtoQuery } from "../../../../types/user/user-types";
import inMemoryDb from "../../../database/inMemory";
import { crudInMemoryCreator } from "../crudInMemoryCreator";

export default {
    ...crudInMemoryCreator<UserDtoQuery, UserQuery>({
        collectionName: "user",
        inMemoryDb,
    }),
    getByWallet: async (wallet: string): Promise<UserQuery | null> => {
        const entity = inMemoryDb["user"].find((u: UserQuery) => {
          if (u.wallet) {
            return u.wallet === wallet;
          }
        });
        return entity ? entity : null;
      },
};
