import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().regex(/^\d+$/, "PORT must be a number"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),

  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((val: string | undefined) =>
      val ? val.split(",").map((s: string) => s.trim()) : ["*"],
    ),

  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .transform((val: string | undefined) => (val ? Number(val) : 60_000)),
  RATE_LIMIT_MAX: z
    .string()
    .optional()
    .transform((val: string | undefined) => (val ? Number(val) : 100)),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters")
    .default("dev-secret-change-in-production-min-32-chars!!"),

  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default("gpt-4o-mini"),
  AI_MAX_TOKENS: z
    .string()
    .optional()
    .transform((val: string | undefined) => (val ? Number(val) : 500)),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.errors
      .map((e: { path: (string | number)[]; message: string }) => `  ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${formatted}`);
  }
  return result.data;
}

export const env = validateEnv();
export type Env = typeof env;
