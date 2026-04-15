import { Router, type IRouter } from "express";

import healthRouter from "./health.js";
import modulesRouter from "./modules.js";
import uploadsRouter from "./uploads.js";
import forumRouter from "./forum.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(modulesRouter);
router.use(uploadsRouter);
router.use("/forum", forumRouter);

export default router;
