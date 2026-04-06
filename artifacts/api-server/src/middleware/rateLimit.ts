import rateLimit from "express-rate-limit";
import { env } from "../lib/env.js";

export const globalRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
    retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
  },
  skip: (req) => req.path === "/api/healthz",
});

export const aiRateLimit = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "AI request limit reached. Please wait before generating more messages.",
    retryAfter: 60,
  },
});
