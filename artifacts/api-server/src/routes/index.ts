import { Router, type IRouter } from "express";

import healthRouter from "./health.js";
import modulesRouter from "./modules.js";
import uploadsRouter from "./uploads.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(modulesRouter);
router.use(uploadsRouter);

export default router;
