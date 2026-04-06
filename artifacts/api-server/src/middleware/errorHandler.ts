import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e: { path: (string | number)[]; message: string }) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  const status = (err as { status?: number }).status ?? 500;
  const message =
    status < 500
      ? err.message
      : "An unexpected error occurred. Please try again.";

  logger.error(
    { err, method: req.method, url: req.url, status },
    "Request error",
  );

  res.status(status).json({ error: message });
};
