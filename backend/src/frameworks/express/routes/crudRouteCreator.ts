import { Request, Response, NextFunction, Router } from "express";


export function crudRouteCreator({
  entityRouter,
  dependencies,
  useCaseName,
  withAuthRoute = {
    add: false,
    delete: false,
    getAll: false,
    getById: false,
    update: false,
  },
  neededRoute = {
    add: true,
    delete: true,
    getAll: true,
    getById: true,
    update: true,
  },
  withAuth
}: {
  entityRouter: Router;
  dependencies: any;
  useCaseName: string;
  withAuthRoute?: {
    add: boolean;
    delete: boolean;
    getAll: boolean;
    getById: boolean;
    update: boolean;
  };
  neededRoute?: {
    add: boolean;
    delete: boolean;
    getAll: boolean;
    getById: boolean;
    update: boolean;
  };
  withAuth?: (req: Request, res: Response, next: NextFunction) => void
}) {
  const { useCases } = dependencies;

  if (neededRoute.add) {
    entityRouter.post(
      `/add`,
      withAuthRoute.add && withAuth
        ? withAuth
        : (req: Request, res: Response, next: NextFunction) => next(),
      async (req: Request, res: Response) => {
        const addEntity =
          useCases[`add${useCaseName}UseCase`](dependencies).execute;

        const newEntity = { ...req.body, created_at: new Date() };

        const response = await addEntity(newEntity);
        res.json(response);
      }
    );
  }

  if (neededRoute.delete) {
    entityRouter.delete(
      `/delete/:id`,
      withAuthRoute.delete && withAuth
        ? withAuth
        : (req: Request, res: Response, next: NextFunction) => next(),
      async (req: Request, res: Response) => {
        const deleteEntity =
          useCases[`delete${useCaseName}UseCase`](dependencies).execute;

        const response = await deleteEntity(req.params.id);
        res.json(response);
      }
    );
  }

  if (neededRoute.getById) {
    entityRouter.get(
      `/getById/:id`,
      withAuthRoute.getById && withAuth
        ? withAuth
        : (req: Request, res: Response, next: NextFunction) => next(),
      async (req: Request, res: Response) => {
        const getEntityById =
          useCases[`get${useCaseName}ByIdUseCase`](dependencies).execute;

        const response = await getEntityById(req.params.id);
        res.json(response);
      }
    );
  }

  if (neededRoute.getAll) {
    entityRouter.get(
      `/all`,
      withAuthRoute.getAll && withAuth
        ? withAuth
        : (req: Request, res: Response, next: NextFunction) => next(),
      async (req: Request, res: Response) => {
        const getAllEntity =
          useCases[`getAll${useCaseName}UseCase`](dependencies).execute;

        const response = await getAllEntity(req.params.id);
        res.json(response);
      }
    );
  }

  if (neededRoute.update) {
    entityRouter.put(
      `/updateById/:id`,
      withAuthRoute.update && withAuth
        ? withAuth
        : (req: Request, res: Response, next: NextFunction) => next(),
      async (req: Request, res: Response) => {
        const newEntity = { ...req.body };

        const updateEntityById =
          useCases[`update${useCaseName}ByIdUseCase`](dependencies).execute;

        const response = await updateEntityById(newEntity, req.params.id);
        res.json(response);
      }
    );
  }
}
