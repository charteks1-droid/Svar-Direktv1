import { Router, type IRouter } from "express";

import healthRouter from "./health.js";
import authRouter from "./auth.js";
import aiRouter from "./ai.js";
import subscriptionRouter from "./subscription.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(aiRouter);
router.use(subscriptionRouter);

export default router;
