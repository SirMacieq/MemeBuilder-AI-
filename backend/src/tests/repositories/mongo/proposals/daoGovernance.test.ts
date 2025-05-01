import repositories from "../../../../frameworks/repositories/mongo";
import MongoConnect from "../../../../frameworks/database/mongo";
import { daoGovernanceRepositoryTests } from "../../common/proposals/daoGovernanceTests";

describe("DAO governance proposal repository", () => {
  beforeAll(async () => {
    await MongoConnect.connect();
  });

  afterAll(async () => {
    await MongoConnect.disconnect();
  });
  
  daoGovernanceRepositoryTests(repositories);
});
