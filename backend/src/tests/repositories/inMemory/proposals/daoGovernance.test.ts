import repositories from '../../../../frameworks/repositories/inMemory';
import { daoGovernanceRepositoryTests } from '../../common/proposals/daoGovernanceTests';

describe("DAO governance proposal repository", () => {
    daoGovernanceRepositoryTests(repositories);
});