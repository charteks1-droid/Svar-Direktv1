import { Router, type IRouter } from "express";
import { z } from "zod";
import { aiRateLimit } from "../middleware/rateLimit.js";
import { validateBody } from "../middleware/validate.js";
import { env } from "../lib/env.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

const GenerateMessageSchema = z.object({
  situation: z.enum([
    "felaktigt",
    "avgift",
    "ingenvar",
    "overklagan",
    "bevis",
  ]),
  tone: z.enum(["kort", "formell", "aggressiv", "stoppa"]),
  fields: z.object({
    namn: z.string().max(100).optional().default(""),
    personnummer: z.string().max(20).optional().default(""),
    arendenummer: z.string().max(50).optional().default(""),
    belopp: z.string().max(20).optional().default(""),
    foretag: z.string().max(100).optional().default(""),
  }),
});

router.post(
  "/ai/generate",
  aiRateLimit,
  validateBody(GenerateMessageSchema),
  async (req, res, next) => {
    try {
      if (!env.AI_API_KEY) {
        res.status(503).json({
          error: "AI generation is not configured on this server.",
        });
        return;
      }

      const { situation, tone, fields } = req.body;
      logger.info({ situation, tone }, "AI generate request");

      res.status(501).json({
        error: "AI generation endpoint is reserved for future use.",
        hint: "Set AI_API_KEY in server environment to enable this feature.",
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
