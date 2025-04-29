export function crudMongoCreator<Dto, T>({
    entityModel,
    entityTypeFormatter,
  }: {
    entityModel: any;
    entityTypeFormatter: (response: any) => T;
  }) {
    return {
      add: async (entity: Dto): Promise<T | null> => {
        try {
  
          const newEntity = new entityModel(entity);
          const response: any = await newEntity.save();
          
          if (response._id) {
            return entityTypeFormatter(response);
          } else {
            return null;
          }
        } catch (e) {
          return null;
        }
      },
      updateById: async (entity: T, id: string): Promise<T | null> => {
        try {
          const result = await entityModel.updateOne({ _id: id }, entity);
  
          if (result.modifiedCount === 1) {
            const response: any = await entityModel.findOne({ _id: id });
            return response._id ? entityTypeFormatter(response) : null;
          } else {
            return null;
          }
        } catch (e) {
          return null;
        }
      },
      delete: async (id: string): Promise<string | null> => {
        try {
          const result = await entityModel.deleteOne({ _id: id });
          if (result.deletedCount === 1) {
            return id;
          } else {
            return null;
          }
        } catch (e) {
          return null;
        }
      },
      getById: async (id: string): Promise<T | null> => {
        try {
          const response: any = await entityModel.findOne({ _id: id });
          if (response._id) {
            return entityTypeFormatter(response);
          } else {
            return null;
          }
        } catch (e) {
          return null;
        }
      },
      getAll: async (): Promise<T[] | null> => {
        try {
          const response = await entityModel.find({});
          if (response.length > 0) {
            return response.map((t: any) => entityTypeFormatter(t));
          } else {
            return [];
          }
        } catch (e) {
          return [];
        }
      },
    };
  }
  