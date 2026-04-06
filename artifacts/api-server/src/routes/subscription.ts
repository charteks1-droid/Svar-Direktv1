import { Router, type IRouter } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

const VerifySchema = z.object({
  userId: z.string().min(1).max(128),
  receipt: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
});

router.get("/subscription/status", (_req, res) => {
  res.status(501).json({
    error: "Subscription verification is not yet configured.",
    hint: "Implement server-side receipt verification with Stripe or RevenueCat.",
  });
});

router.post(
  "/subscription/verify",
  validateBody(VerifySchema),
  async (req, res, next) => {
    try {
      const { userId } = req.body;
      logger.info({ userId }, "Subscription verify request");

      res.status(501).json({
        error: "Subscription verification is not yet implemented.",
        hint: "Connect Stripe or RevenueCat to enable premium verification.",
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
