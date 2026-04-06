import type { RequestHandler } from "express";
import type { ZodTypeAny, z } from "zod";

export function validateBody<T extends ZodTypeAny>(
  schema: T,
): RequestHandler<object, unknown, z.infer<T>> {
  return (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateQuery<T extends ZodTypeAny>(
  schema: T,
): RequestHandler<object, unknown, unknown, z.infer<T>> {
  return (req, _res, next) => {
    req.query = schema.parse(req.query);
    next();
  };
}
