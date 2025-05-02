import repositories from "../../../../frameworks/repositories/mongo";
import MongoConnect from "../../../../frameworks/database/mongo";
import { fundedTokenRepositoryTests } from "../../common/proposals/fundedTokenTests";

describe("Funded token proposal repository", () => {
  beforeAll(async () => {
    await MongoConnect.connect();
  });

  afterAll(async () => {
    await MongoConnect.disconnect();
  });
  
  fundedTokenRepositoryTests(repositories);
});
