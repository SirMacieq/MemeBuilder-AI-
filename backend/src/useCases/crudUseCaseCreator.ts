import ResponseError from "../frameworks/common/ResponseError";
import ResponseRequest from "../frameworks/common/ResponseRequest";
import { capitalizeFirstLetter } from "../services/utils/string";

export function crudUseCase<Dto, DtoUpdate>({
  repositoryName,
  useCaseName,
  alreadyExistFunction,
  alreadyExistKey,
}: {
  repositoryName: string;
  useCaseName: string;
  alreadyExistFunction?: (test: string) => any; // exemple const existTag = await tagRepository.getByKey(tag.key);
  alreadyExistKey?: string; //tag.key
}) {
  const add = (dependencies: any) => {
    const repository = dependencies.repositories[repositoryName];
    if (!repository) {
      throw new Error(
        `the ${useCaseName} repository should be exist in dependencies`
      );
    }

    const execute = async (entity: Dto): Promise<ResponseRequest> => {
      if (alreadyExistFunction && alreadyExistKey) {
        const existEntity = await alreadyExistFunction(alreadyExistKey);
        if (existEntity) {
          return new ResponseRequest({
            status: 401,
            error: new ResponseError({
              error: `${useCaseName} already exist`,
              msg: "You have to choose an other ${useCaseName}",
            }),
            content: null,
          });
        }
      }

      const addedEntity = await repository.add(entity);
      if (addedEntity) {
        return new ResponseRequest({
          status: 200,
          error: null,
          content: {
            [useCaseName]: addedEntity,
          },
        });
      } else {
        return new ResponseRequest({
          status: 500,
          error: new ResponseError({
            error: "Impossible to add in db",
            msg: "Problem with DB",
          }),
          content: null,
        });
      }
    };

    return { execute };
  };

  const deleted = (dependencies: any) => {
    const repository = dependencies.repositories[repositoryName];
    if (!repository) {
      throw new Error(
        `the ${useCaseName} repository should be exist in dependencies`
      );
    }

    const execute = async (id: string): Promise<ResponseRequest> => {
      const deletedEntity = await repository.delete(id);

      if (deletedEntity) {
        return new ResponseRequest({
          status: 200,
          error: null,
          content: {
            [useCaseName]: deletedEntity,
          },
        });
      } else {
        return new ResponseRequest({
          status: 500,
          error: new ResponseError({
            error: "Impossible to delete in db",
            msg: "Problem with DB or tag does not exist",
          }),
          content: null,
        });
      }
    };

    return { execute };
  };

  const getById = (dependencies: any) => {
    const repository = dependencies.repositories[repositoryName];
    if (!repository) {
      throw new Error(
        `the ${useCaseName} repository should be exist in dependencies`
      );
    }

    const execute = async (id: string): Promise<ResponseRequest> => {
      const entity = await repository.getById(id);

      if (entity) {
        return new ResponseRequest({
          status: 200,
          error: null,
          content: {
            [useCaseName]: entity,
          },
        });
      } else {
        return new ResponseRequest({
          status: 404,
          error: new ResponseError({
            error: `${useCaseName} not found`,
            msg: `${useCaseName} doesn't exist in DB`,
          }),
          content: null,
        });
      }
    };

    return { execute };
  };

  const getAll = (dependencies: any) => {
    const repository = dependencies.repositories[repositoryName];
    if (!repository) {
      throw new Error(
        `the ${useCaseName} repository should be exist in dependencies`
      );
    }

    const execute = async (): Promise<ResponseRequest> => {
      const entities = await repository.getAll();

      if (entities) {
        return new ResponseRequest({
          status: 200,
          error: null,
          content: {
            [`${useCaseName}s`]: entities,
          },
        });
      } else {
        return new ResponseRequest({
          status: 404,
          error: new ResponseError({
            error: `${useCaseName} not found`,
            msg: `${useCaseName} doesn't exist in DB`,
          }),
          content: null,
        });
      }
    };

    return { execute };
  };

  const updateById = (dependencies: any) => {
    const repository = dependencies.repositories[repositoryName];
    if (!repository) {
      throw new Error(
        `the ${useCaseName} repository should be exist in dependencies`
      );
    }

    const execute = async (
      newData: DtoUpdate,
      id: string
    ): Promise<ResponseRequest> => {
      const existEntity = await repository.getById(id);

      if (!existEntity) {
        return new ResponseRequest({
          status: 404,
          error: new ResponseError({
            error: `${useCaseName} doesn't exist`,
            msg: `${useCaseName} doesn't exist in the database`,
          }),
          content: null,
        });
      }

      let updatedEntity: any;

      if (existEntity._doc) {
        updatedEntity = { ...existEntity._doc, ...newData };
      } else {
        updatedEntity = { ...existEntity, ...newData };
      }

      const updatedEntityDb = await repository.updateById(updatedEntity, id);

      if (updatedEntityDb) {
        return new ResponseRequest({
          status: 200,
          error: null,
          content: {
            [useCaseName]: updatedEntity,
          },
        });
      } else {
        return new ResponseRequest({
          status: 500,
          error: new ResponseError({
            error: "Impossible to update db",
            msg: "Problem with DB",
          }),
          content: null,
        });
      }
    };

    return { execute };
  };

  return {
    [`add${capitalizeFirstLetter(useCaseName)}UseCase`]: add,
    [`delete${capitalizeFirstLetter(useCaseName)}UseCase`]: deleted,
    [`get${capitalizeFirstLetter(useCaseName)}ByIdUseCase`]: getById,
    [`getAll${capitalizeFirstLetter(useCaseName)}UseCase`]: getAll,
    [`update${capitalizeFirstLetter(useCaseName)}ByIdUseCase`]: updateById,
  };
}
