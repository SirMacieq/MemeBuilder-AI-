import { capitalizeFirstLetter } from "../../services/utils/string";

export function crudUseCaseTests<Dto extends { [key: string]: any }>({
  repositories,
  useCases,
  newEntity1,
  newEntity2,
  useCaseName,
}: {
  repositories: any;
  useCases: any;
  newEntity1: Dto;
  newEntity2: Dto;
  useCaseName: string;
}) {
  const dependencies = {
    repositories,
  };

  type T = Dto & {
    _id: string;
  };
  console.log("useCaseName",useCaseName)
  it(`Should add ${useCaseName}`, async () => {
    const addEntity =
      useCases[`add${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const addedEntity = await addEntity(newEntity1);
    expect(addedEntity).toBeDefined();
    expect(addedEntity.status).toBe(200);

    const contentEntity: T = addedEntity.content[useCaseName];
    for (const key in contentEntity) {
      if (key !== "_id") {
        expect(contentEntity[key]).toBe(newEntity1[key]);
      }
    }

    if (addedEntity?.content[useCaseName]._id) {
      await repositories[`${useCaseName}Repository`].delete(
        addedEntity?.content[useCaseName]._id
      );
    }
  });

  it(`Should delete ${useCaseName}`, async () => {
    const addEntity =
      useCases[`add${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const deleteEntity =
      useCases[`delete${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const addedEntity = await addEntity(newEntity1);
    expect(addedEntity).toBeDefined();
    expect(addedEntity.status).toBe(200);
    expect(addedEntity.content[useCaseName]._id).toBeDefined();

    const deletedEntity = await deleteEntity(
      addedEntity.content[useCaseName]._id ?? ""
    );

    expect(deletedEntity.content[useCaseName]).toBe(
      addedEntity.content[useCaseName]._id
    );
  });

  it(`Should get by id ${useCaseName}`, async () => {
    const addEntity =
      useCases[`add${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const getEntityById =
      useCases[`get${capitalizeFirstLetter(useCaseName)}ByIdUseCase`](
        dependencies
      ).execute;

    const addedEntity = await addEntity(newEntity1);

    expect(addedEntity?.content[useCaseName]._id).toBeDefined();

    const entityById = await getEntityById(
      addedEntity?.content[useCaseName]._id ?? ""
    );
    expect(entityById.content[useCaseName]).toBe(
      addedEntity?.content[useCaseName]
    );

    if (addedEntity?.content[useCaseName]._id) {
      await repositories[`${useCaseName}Repository`].delete(
        addedEntity?.content[useCaseName]._id
      );
    }
  });

  it(`Should get all ${useCaseName}`, async () => {
    const addEntity =
      useCases[`add${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const getAllEntity =
      useCases[`getAll${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const addedEntity1 = await addEntity(newEntity1);
    const addedEntity2 = await addEntity(newEntity2);

    expect(addedEntity1?.content[useCaseName]._id).toBeDefined();
    expect(addedEntity2?.content[useCaseName]._id).toBeDefined();

    const allEntities = await getAllEntity();

    expect(allEntities.content[`${useCaseName}s`]).toEqual([
      addedEntity1?.content[useCaseName],
      addedEntity2?.content[useCaseName],
    ]);

    if (addedEntity1?.content[useCaseName]._id) {
      await repositories[`${useCaseName}Repository`].delete(
        addedEntity1?.content[useCaseName]._id
      );
    }

    if (addedEntity2?.content[useCaseName]._id) {
      await repositories[`${useCaseName}Repository`].delete(
        addedEntity2?.content[useCaseName]._id
      );
    }
  });

  it(`Should update ${useCaseName}`, async () => {
    const addEntity =
      useCases[`add${capitalizeFirstLetter(useCaseName)}UseCase`](
        dependencies
      ).execute;

    const updateEntityById =
      useCases[`update${capitalizeFirstLetter(useCaseName)}ByIdUseCase`](
        dependencies
      ).execute;

    const addedEntity1 = await addEntity(newEntity1);

    expect(addedEntity1?.content[useCaseName]._id).toBeDefined();

    const updatedEntity = await updateEntityById(
      { ...newEntity2, _id: addedEntity1?.content[useCaseName]._id },
      addedEntity1?.content[useCaseName]._id
    );

    expect(updatedEntity?.content[useCaseName]).toEqual({
      ...newEntity2,
      _id: addedEntity1?.content[useCaseName]._id,
    });

    if (addedEntity1?.content[useCaseName]._id) {
      await repositories[`${useCaseName}Repository`].delete(
        addedEntity1?.content[useCaseName]._id
      );
    }
  });
}
