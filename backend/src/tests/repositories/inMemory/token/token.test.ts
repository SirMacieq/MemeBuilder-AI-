import repositories from '../../../../frameworks/repositories/inMemory';
import { tokenRepositoryTests } from '../../common/token/tokenTests';

describe("Token published repository", () => {
    tokenRepositoryTests(repositories);
});