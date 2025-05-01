import repositories from "../../../../frameworks/repositories/mongo";
import MongoConnect from "../../../../frameworks/database/mongo";
import { treasuryTokenRepositoryTests } from "../../common/proposals/treasuryTokentTests";

describe("Treasury token proposal repository", () => {
  beforeAll(async () => {
    await MongoConnect.connect();
  });

  afterAll(async () => {
    await MongoConnect.disconnect();
  });
  
  treasuryTokenRepositoryTests(repositories);
});
