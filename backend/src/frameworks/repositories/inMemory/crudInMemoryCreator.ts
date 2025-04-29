import mongoose from "mongoose";

export function crudInMemoryCreator<Dto, T>({
  collectionName,
  inMemoryDb,
}: {
  collectionName: string;
  inMemoryDb: any;
}) {
  type D = T & {
    _id: string;
  };

  return {
    add: async (newEntity: Dto): Promise<T | null> => {
      inMemoryDb[collectionName].push({
        ...newEntity,
        _id: new mongoose.Types.ObjectId().toString(),
      });

      return inMemoryDb[collectionName][inMemoryDb[collectionName].length - 1];
    },
    updateById: async (entity: T, id: string): Promise<T | null> => {
      const index = inMemoryDb[collectionName].findIndex(
        (u: D) => u._id && u._id === id
      );
      if (index !== -1) {
        inMemoryDb[collectionName][index] = entity;
        return { ...inMemoryDb[collectionName][index] };
      }
      return null;
    },
    delete: async (id: string): Promise<string | null> => {
      const index = inMemoryDb[collectionName].findIndex(
        (u: D) => u._id === id
      );
      if (index >= 0) {
        inMemoryDb[collectionName].splice(index, 1);
        return id;
      }
      return null;
    },
    getById: async (id: string): Promise<T | null> => {
      const entity = inMemoryDb[collectionName].find((u: D) => {
        if (u._id) {
          return u._id === id;
        }
      });
      return entity ? entity : null;
    },
    getAll: async () => {
      return inMemoryDb[collectionName];
    },
  };
}
