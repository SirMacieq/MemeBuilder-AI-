import repositories from '../../../../frameworks/repositories/inMemory';
import { treasuryTokenRepositoryTests } from '../../common/proposals/treasuryTokentTests';

describe("Treasury token proposal repository", () => {
    treasuryTokenRepositoryTests(repositories);
});