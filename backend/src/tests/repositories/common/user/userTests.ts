import { UserDtoQuery, UserQuery } from "../../../../types/user/user-types";
import { crudTestCreator } from "../crudTestCreator";
import User from "../../../../entities/user/User";

export const userRepositoryTests = (repositories: any) => {
    const { userRepository } = repositories;

    const user1: UserDtoQuery = new User({
        wallet: "wallet-fr-001",
        nickname: "Bobby",
        bio: "I love my bio",
        avatar: "avatar1.jpg",
        created_at: 1672531200,
        last_login: 1704067200,
    });

    const user2: UserDtoQuery = new User({
        wallet: "wallet-fr-002",
        nickname: "JCVD",
        bio: "I am aware bro!",
        avatar: "avatar2.jpg",
        created_at: 1667260800,
        last_login: 1705459200,
    });
    
    crudTestCreator<UserDtoQuery, UserQuery>(
        userRepository,
        user1,
        user2,
        "user"
    );

    it(`user should get by wallet`, async ()=>{
        const addedUser = await userRepository.add(user1);
        expect(addedUser).toBeDefined();

        const user = await userRepository.getByWallet(user1.wallet);
        expect(user.wallet).toBe(user1.wallet);

        if (addedUser._id) {
            await userRepository.delete(addedUser._id);
        }
    })
}