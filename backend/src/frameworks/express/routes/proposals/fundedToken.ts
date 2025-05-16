import express from "express";
import dependencies from "../../../../config/dependencies";
import { withAuth } from "../../middlewares/withAuth";
import { crudRouteCreator } from "../crudRouteCreator";
import { botFundedToken } from "../../../../services/monitoring/bot";
import cron from "node-cron";

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

let isRunning = false;
//"*/10 * * * * *" "*/15 * * * *"
cron.schedule("*/15 * * * * *", async () => {
  if (isRunning) return console.log("⏳ botFundedToken déjà en cours");
  isRunning = true;

  try {
    const urlSmartContract = await botFundedToken(dependencies);


  } catch (error) {
    console.error("Erreur botFundedToken:", error)
  } finally {
    isRunning = false;
  }
})