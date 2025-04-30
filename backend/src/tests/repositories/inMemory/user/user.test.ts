import repositories from '../../../../frameworks/repositories/inMemory';
import { userRepositoryTests } from '../../common/user/userTests';

describe("User repository", () => {
    userRepositoryTests(repositories);
});