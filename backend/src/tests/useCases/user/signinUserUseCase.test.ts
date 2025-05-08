import useCases from "../../../useCases"
import User from "../../../entities/user/User"
import repositories from "../../../frameworks/repositories/inMemory"
import { UserSigninQuery } from "../../../types/user/user-types"
import ResponseRequest from "../../../frameworks/common/ResponseRequest"
const { userRepository } = repositories
const { signinUserUseCase } = useCases

describe("Signin User use case", () => {
  const dependencies = {
    repositories: { userRepository },
  };

  const signinUser = signinUserUseCase(dependencies).execute

  it("should return an error when wallet is missing", async () => {
    const testData: any = {} 

    const result = await signinUser(testData);

    expect(result.status).toBe(500);
    if (result.error && typeof result.error !== 'string'){
      expect(result.error.error).toBe("It miss some information to login user");
      expect(result.error.msg).toBe("Your wallet need to be connected")
    }
  });


  it("should create a new user when the wallet does not exist", async () => {
    const testData: UserSigninQuery = {
      wallet: "wallet-fr-003"
    };

    const result: ResponseRequest = await signinUser(testData);

    expect(result.status).toBe(201)
    expect(result.content.user.wallet).toBe(testData.wallet)
    expect(result.content.title).toBe("First connexion")
    expect(result.content.validationToken).toBeDefined()
  })

  it("should signin an existing user", async () => {
    const existingUser = new User({
      wallet: "wallet-fr-001",
      nickname: "Test User",
      bio: "Bio of Test User",
      avatar: "avatar1.jpg",
      created_at: Date.now(),
      last_login: Date.now(),
    })

    const userSaved = await userRepository.add(existingUser)

    const testData: UserSigninQuery = {
      wallet: "wallet-fr-001"
    }

    const result: ResponseRequest = await signinUser(testData);

    expect(result.status).toBe(200)
    expect(result.content.token).toBeDefined()

    if (userSaved?._id) {
      await userRepository.delete(userSaved._id)
    }
  })

  it("should ask user to complete information if it's the first connection", async () => {
    const testData: UserSigninQuery = {
      wallet: "wallet-fr-004"
    }

    const result: ResponseRequest = await signinUser(testData)

    expect(result.status).toBe(201)
    expect(result.content.user.wallet).toBe(testData.wallet)
    expect(result.content.title).toBe("First connexion")
    expect(result.content.msg).toBe("You need to add some user account information")
    expect(result.content.validationToken).toBeDefined()
  })
})
