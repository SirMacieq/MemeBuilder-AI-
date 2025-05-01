import ResponseError from "../../frameworks/common/ResponseError";
import ResponseRequest from "../../frameworks/common/ResponseRequest";
import { UserDtoQuery, UserSigninQuery } from "../../types/user/user-types";
import { createToken } from "../../services/utils/token";
import User from "../../entities/user/User";

export default (dependencies: any) => {
  const {
    repositories: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("the user repository should be exist in dependencies");
  }

  const execute = async (
    userData: UserSigninQuery
  ): Promise<ResponseRequest> => {
    try {
      if ("wallet" in userData === false) {
        return new ResponseRequest({
          status: 500,
          error: new ResponseError({
            error: "It miss some information to login user",
            msg: "Your wallet need to be connected",
          }),
          content: null,
        });
      }

      const existUser = await userRepository.getByWallet(userData.wallet);
      if (!existUser) {
        const now = new Date().getTime();
        const newUser = new User({
          wallet: userData.wallet,
          nickname: null,
          bio: null,
          created_at: now,
          last_login: now,
        });
        const userResponseDB = await userRepository.add(newUser);
        if (!userResponseDB) {
          return new ResponseRequest({
            status: 500,
            error: new ResponseError({
              error: "Problem to save user",
              msg: "a problem occured during the user creation",
            }),
            content: null,
          });
        } else {
          const validationToken = await createToken(userResponseDB._id);

          return new ResponseRequest({
            status: 201,
            error: null,
            content: {
              user: userResponseDB,
              title: "First connexion",
              msg: "You need to add some user account information",
              validationToken,
            },
          });
        }
      } else {
        let userWithoutWallet: any = {};
        if (existUser._doc) {
          userWithoutWallet = { ...existUser._doc };
        } else {
          userWithoutWallet = { ...existUser };
        }
        delete userWithoutWallet["wallet"];

        const token = await createToken(existUser._id);
        return new ResponseRequest({
          status: 200,
          error: null,
          content: {
            user: userWithoutWallet,
            token,
          },
        });
      }
    } catch (err) {
      return new ResponseRequest({
        status: 500,
        error: new ResponseError({
          error: "internal error",
          msg: "a problem occured",
        }),
        content: null,
      });
    }
  };

  return { execute };
};
