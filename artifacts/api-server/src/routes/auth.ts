import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { db, users } from "@workspace/db";
import { signToken, verifyToken } from "../lib/auth.js";
import { validateBody } from "../middleware/validate.js";
import { authenticate, type AuthRequest } from "../middleware/authenticate.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

const RegisterSchema = z.object({
  email: z
    .string()
    .email("Ogiltig e-postadress.")
    .max(254)
    .transform((s) => s.trim().toLowerCase()),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken.").max(128),
});

const LoginSchema = z.object({
  email: z
    .string()
    .email("Ogiltig e-postadress.")
    .max(254)
    .transform((s) => s.trim().toLowerCase()),
  password: z.string().min(1).max(128),
});

router.post("/auth/register", validateBody(RegisterSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof RegisterSchema>;

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "E-postadressen används redan." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email, createdAt: users.createdAt });

    const token = signToken({ userId: user.id, email: user.email });
    logger.info({ userId: user.id }, "User registered");
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", validateBody(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof LoginSchema>;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Fel e-postadress eller lösenord." });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Fel e-postadress eller lösenord." });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });
    logger.info({ userId: user.id }, "User logged in");
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

router.get("/auth/me", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db
      .select({ id: users.id, email: users.email, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, req.user!.userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "Användare hittades inte." });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/refresh", async (req, res, next) => {
  try {
    const { token } = req.body as { token?: string };
    if (!token) {
      res.status(400).json({ error: "Token saknas." });
      return;
    }
    const payload = verifyToken(token);
    const newToken = signToken({ userId: payload.userId, email: payload.email });
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: "Ogiltig token." });
  }
});

export default router;
