import { crudMongoCreator } from "../crudMongoCreator";
import { UserDtoQuery, UserQuery } from "../../../../types/user/user-types";
import UserModel from "../../../database/mongo/schemas/user.schema";
import { userTypeFormatter } from "../../../common/adapter/user/userAdapter";

export default {
    ...crudMongoCreator<UserDtoQuery, UserQuery>({
        entityModel: UserModel,
        entityTypeFormatter: userTypeFormatter,
    }),
    getByWallet: async (
        wallet: string,
      ): Promise<UserQuery | null> => {
        try {
          const response: any = await UserModel.findOne({ wallet: wallet });
          if (response._id) {
            return userTypeFormatter(response);
          } else {
            return null;
          }
        } catch (e) {
          return null;
        }
    },
};
