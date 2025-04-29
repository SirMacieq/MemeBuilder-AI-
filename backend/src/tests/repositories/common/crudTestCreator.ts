import { cloneDeep } from "lodash";

export function crudTestCreator<Dto extends { [key: string]: any }, T>(
  entityRepository: any,
  newEntity1: Dto,
  newEntity2: Dto,
  entityName: string
) {
  it(`New ${entityName} should be added`, async () => {
    type T = Dto & {
      _id: string;
    };
    const addedEntity: T = await entityRepository.add(newEntity1);
    expect(addedEntity).toBeDefined();
    expect(addedEntity?._id).toBeDefined();

    if (addedEntity?._id) {
      for (const key in addedEntity) {
        if (key !== "_id") {
          expect(addedEntity[key]).toEqual(newEntity1[key]);
        }
      }
    }

    if (addedEntity?._id) {
      await entityRepository.delete(addedEntity._id);
    }
  });

  it(`New ${entityName} should be added and returned and deleted`, async () => {
    const willBeDeletedEntity: Dto = newEntity1;

    const shouldStayEntity: Dto = newEntity2;

    const [willBeDeletedAddedEntity, shouldStayAddedEntity] = await Promise.all(
      [
        entityRepository.add(willBeDeletedEntity),
        entityRepository.add(shouldStayEntity),
      ]
    );

    expect(willBeDeletedAddedEntity).toBeDefined();
    expect(shouldStayAddedEntity).toBeDefined();

    const deletedEntity = await entityRepository.delete(
      willBeDeletedAddedEntity?._id ?? ""
    );
    expect(deletedEntity).toEqual(willBeDeletedAddedEntity?._id);
    if (deletedEntity) {
      const shouldBeUndefinedTag =
        await entityRepository.getById(deletedEntity);
      expect(shouldBeUndefinedTag).toBe(null);
    } else {
      fail("user not deleted");
    }

    const shouldBeFindTag = await entityRepository.getById(
      shouldStayAddedEntity?._id ?? ""
    );

    expect(shouldBeFindTag).toBeDefined();
    if (shouldBeFindTag?._id) {
      await entityRepository.delete(shouldBeFindTag._id);
    }
  });

  it(` ${entityName} should be update and returned`, async () => {
    type T = Dto & {
      _id: string;
    };

    const addedEntity = await entityRepository.add(newEntity1);
    expect(addedEntity._id).toBeDefined();

    const cloneEntity: T = cloneDeep({
      ...addedEntity,
      ...newEntity2,
    });

    const updatedEntity = await entityRepository.updateById(
      cloneEntity,
      addedEntity?._id ?? ""
    );
    expect(updatedEntity).toBeDefined();

    if (updatedEntity?._id) {
      for (const key in updatedEntity) {
        if (key !== "_id") {
          expect(updatedEntity[key]).toEqual(cloneEntity[key]);
        }
      }
    }

    if (addedEntity?._id) {
      await entityRepository.delete(addedEntity._id);
    }
  });
}
