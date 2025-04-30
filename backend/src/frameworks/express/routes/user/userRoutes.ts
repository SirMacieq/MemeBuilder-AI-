import express from 'express';
import dependencies from '../../../../config/dependencies';
import { withAuth } from '../../middlewares/withAuth';
import { crudRouteCreator } from '../crudRouteCreator';
import signinUserController from '../../../../controllers/user/signinUser.controller';

export const userRouter = express.Router();

crudRouteCreator({
    entityRouter: userRouter,
    dependencies,
    useCaseName: "User",
    withAuthRoute: {
        add: false,
        delete: true,
        getAll: false,
        getById: false,
        update: true,
    },
    neededRoute: {
        add: false,
        delete: true,
        getAll: true,
        getById: true,
        update: true,
    },
    withAuth: withAuth
})

userRouter.post('/signin', signinUserController(dependencies).signinUserController)
