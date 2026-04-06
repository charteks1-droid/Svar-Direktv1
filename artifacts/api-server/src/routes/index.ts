import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import aiRouter from "./ai.js";
import subscriptionRouter from "./subscription.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(subscriptionRouter);

export default router;
