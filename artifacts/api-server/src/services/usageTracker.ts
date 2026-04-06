import { count, eq, and } from "drizzle-orm";
import { db, aiGenerations } from "@workspace/db";

export const DAILY_LIMIT = 4;

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkDailyLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
}> {
  const result = await db
    .select({ count: count() })
    .from(aiGenerations)
    .where(
      and(
        eq(aiGenerations.userId, userId),
        eq(aiGenerations.date, todayUTC()),
        eq(aiGenerations.requestStatus, "success"),
      ),
    );

  const used = Number(result[0]?.count ?? 0);
  const remaining = Math.max(0, DAILY_LIMIT - used);
  return { allowed: remaining > 0, used, remaining, limit: DAILY_LIMIT };
}

export async function recordGeneration(data: {
  userId: string;
  deviceId: string;
  institution: string;
  caseType: string;
  tone?: string;
  length?: string;
  requestStatus: "success" | "failed" | "limit_exceeded";
  generatedText?: string;
}): Promise<void> {
  await db.insert(aiGenerations).values({
    userId: data.userId,
    deviceId: data.deviceId,
    date: todayUTC(),
    institution: data.institution,
    caseType: data.caseType,
    tone: data.tone,
    length: data.length,
    requestStatus: data.requestStatus,
    generatedText: data.generatedText,
  });
}
