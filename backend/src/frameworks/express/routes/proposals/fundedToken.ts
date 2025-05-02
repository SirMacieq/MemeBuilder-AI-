import express from "express";
import dependencies from "../../../../config/dependencies";
import { withAuth } from "../../middlewares/withAuth";
import { crudRouteCreator } from "../crudRouteCreator";

export const fundedTokenRouter = express.Router();

crudRouteCreator({
  entityRouter: fundedTokenRouter,
  dependencies,
  useCaseName: "FundedToken",
  withAuthRoute: {
    add: true,
    delete: true,
    getAll: true,
    getById: true,
    update: true,
  },
  neededRoute: {
    add: true,
    delete: true,
    getAll: true,
    getById: true,
    update: true,
  },
  withAuth: withAuth,
});
