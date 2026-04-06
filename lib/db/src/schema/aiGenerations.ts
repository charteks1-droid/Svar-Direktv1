import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiGenerations = pgTable("ai_generations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  deviceId: text("device_id").notNull(),
  date: text("date").notNull(),
  institution: text("institution"),
  caseType: text("case_type"),
  tone: text("tone"),
  length: text("length"),
  requestStatus: text("request_status").notNull().default("success"),
  generatedText: text("generated_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAiGenerationSchema = createInsertSchema(aiGenerations).omit({
  id: true,
  createdAt: true,
});

export type AiGeneration = typeof aiGenerations.$inferSelect;
export type InsertAiGeneration = z.infer<typeof insertAiGenerationSchema>;
