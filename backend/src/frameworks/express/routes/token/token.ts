import express from "express";
import dependencies from "../../../../config/dependencies";
import { withAuth } from "../../middlewares/withAuth";
import { crudRouteCreator } from "../crudRouteCreator";

export const tokenRouter = express.Router();

crudRouteCreator({
  entityRouter: tokenRouter,
  dependencies,
  useCaseName: "Token",
  withAuthRoute: {
    add: true,
    delete: true,
    getAll: false,
    getById: false,
    update: true,
  },
  neededRoute: {
    add: true,
    delete: false,
    getAll: true,
    getById: true,
    update: false,
  },
  withAuth: withAuth,
});
