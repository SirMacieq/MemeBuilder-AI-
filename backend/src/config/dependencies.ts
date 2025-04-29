import repositoriesInMemory from "../frameworks/repositories/inMemory";
import repositoriesInMongo from "../frameworks/repositories/mongo";
import useCases from "../useCases";

export const changeRepositories = (env: string) => {
  switch (env) {
    case "inMemory":
      return repositoriesInMemory;
    case "mongo":
      return repositoriesInMongo;
    default:
      return repositoriesInMemory;
  }
};

const repositories = changeRepositories(process.env.ENV_REPOSITORIES as string);

export default {
  useCases,
  repositories,
};
