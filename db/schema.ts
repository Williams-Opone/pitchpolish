import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { SectionScore } from "@/lib/types";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  deckName: text("deck_name").notNull(),
  fileName: text("file_name").notNull(),
  score: integer("score").notNull(),
  band: text("band").notNull().default(""),
  slideCount: integer("slide_count").notNull().default(0),
  wordCount: integer("word_count").notNull().default(0),
  sections: jsonb("sections").notNull().$type<SectionScore[]>(),
  redFlags: jsonb("red_flags").notNull().$type<string[]>(),
  summary: text("summary").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  isSample: boolean("is_sample").notNull().default(false),
  /**
   * Driver-agnostic owner key: "clerk:<userId>" when Clerk is active,
   * "local:<id>" for the built-in session driver, null for shared/public rows.
   * Clerk itself never touches this database — we only store its user id.
   */
  owner: text("owner"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
