import { Router, type IRouter } from "express";

import healthRouter from "./health.js";
import modulesRouter from "./modules.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(modulesRouter);

export default router;
