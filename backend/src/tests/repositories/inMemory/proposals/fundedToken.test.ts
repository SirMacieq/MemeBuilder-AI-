import repositories from '../../../../frameworks/repositories/inMemory';
import { fundedTokenRepositoryTests } from '../../common/proposals/fundedTokenTests';

describe("Funded token proposal repository", () => {
    fundedTokenRepositoryTests(repositories);
});