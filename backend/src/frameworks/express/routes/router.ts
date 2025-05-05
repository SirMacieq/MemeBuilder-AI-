import express from "express";
import { userRouter } from "./user/userRoutes";
import { fundedTokenRouter } from "./proposals/fundedToken";
import { treasuryTokenRouter } from "./proposals/treasuryToken";
import { daoGovernanceRouter } from "./proposals/daoGovernance";
import { tokenRouter } from "./token/token"
export const router = express.Router();

router.use("/user", userRouter);
router.use("/proposals/funded-token", fundedTokenRouter);
router.use("/proposals/treasury-token", treasuryTokenRouter);
router.use("/proposals/dao-governance", daoGovernanceRouter);
router.use("/token", tokenRouter);
