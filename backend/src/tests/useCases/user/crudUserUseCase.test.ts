import { UserDtoQuery } from "../../../types/user/user-types";
import { crudUseCaseTests } from "../crudUseCaseTestCreator";
import User from "../../../entities/user/User";
import repositories from "../../../frameworks/repositories/inMemory";
import useCases from "../../../useCases";

describe("User CRUD Test", () => {
  const user1: UserDtoQuery = new User({
    wallet: "wallet-fr-001",
    nickname: "Bobby",
    bio: "I love my bio",
    created_at: 1672531200, // Timestamp : 01/01/2023
    last_login: 1704067200, // Timestamp : 01/01/2024
  });

  const user2: UserDtoQuery = new User({
    wallet: "wallet-fr-002",
    nickname: "JCVD",
    bio: "I am aware bro!",
    created_at: 1667260800, // Timestamp : 01/11/2022
    last_login: 1705459200, // Timestamp : 15/01/2024
  });

  crudUseCaseTests<UserDtoQuery>({
    repositories,
    useCases,
    newEntity1: user1,
    newEntity2: user2,
    useCaseName: "user",
  })

  it(`user should get by wallet`, async () => {
    const { userRepository } = repositories;

    const addedUser = await userRepository.add(user1);
    expect(addedUser).toBeDefined();

    const user = await userRepository.getByWallet(user1.wallet)
    if(user){
    expect(user.wallet).toBe(user1.wallet)
    }
    if (addedUser?._id) {
      await userRepository.delete(addedUser._id)
    }
  });
});
