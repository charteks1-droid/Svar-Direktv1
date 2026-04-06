import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../lib/auth.js";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Autentisering krävs." });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Ogiltig eller utgången session. Logga in igen." });
  }
}
