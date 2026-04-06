import { Router, type IRouter } from "express";
import { z } from "zod";

import { aiRateLimit } from "../middleware/rateLimit.js";
import { validateBody } from "../middleware/validate.js";
import { authenticate, type AuthRequest } from "../middleware/authenticate.js";
import { logger } from "../lib/logger.js";
import { generateFormalMessage } from "../services/aiGeneration.js";
import { checkDailyLimit, recordGeneration, DAILY_LIMIT } from "../services/usageTracker.js";
const router: IRouter = Router();

const GenerateMessageSchema = z.object({
  deviceId: z.string().min(1).max(200).default("unknown"),
  institution: z.string().min(1).max(200),
  caseType: z.string().min(1).max(100),
  situation: z.string().min(10).max(2000),
  goal: z.string().min(5).max(500),
  tone: z.enum(["formell", "assertiv", "kortfattad", "detaljerad"]),
  length: z.enum(["kort", "standard", "detaljerat"]),
});

router.post(
  "/ai/generate",
  aiRateLimit,
  authenticate,
  validateBody(GenerateMessageSchema),
  async (req: AuthRequest, res, next) => {
    const userId = req.user!.userId;
    const { deviceId, institution, caseType, situation, goal, tone, length } = req.body;

    try {
      const { allowed, used, remaining } = await checkDailyLimit(userId);

      if (!allowed) {
        await recordGeneration({
          userId,
          deviceId,
          institution,
          caseType,
          tone,
          length,
          requestStatus: "limit_exceeded",
        });
        res.status(429).json({
          error: "Dagsgräns nådd",
          message: `Du har använt dina ${DAILY_LIMIT} AI-generationer för idag. Prova igen imorgon.`,
          used,
          remaining: 0,
          limit: DAILY_LIMIT,
        });
        return;
      }

      logger.info({ userId, institution, caseType, tone, length }, "AI generate request");

      const message = await generateFormalMessage({ institution, caseType, situation, goal, tone, length });

      await recordGeneration({
        userId,
        deviceId,
        institution,
        caseType,
        tone,
        length,
        requestStatus: "success",
        generatedText: message,
      });

      res.json({
        message,
        used: used + 1,
        remaining: remaining - 1,
        limit: DAILY_LIMIT,
      });
    } catch (err) {
      await recordGeneration({
        userId,
        deviceId,
        institution,
        caseType,
        tone,
        length,
        requestStatus: "failed",
      }).catch(() => {});
      next(err);
    }
  },
);

router.get("/ai/usage", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { used, remaining, limit } = await checkDailyLimit(userId);
    res.json({ used, remaining, limit });
  } catch (err) {
    next(err);
  }
});

export default router;
