import type { ReportRow } from "./types";

/**
 * Ephemeral in-memory report store.
 * When the database is unreachable or the schema is stale, analyses still
 * complete and are served from here (free tier, zero setup). Reports live
 * for one hour or until the server restarts — DB-backed reports are
 * permanent once a database is configured.
 */

const TTL_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 100;

// Shared via globalThis so every bundled route chunk sees the same store.
const g = globalThis as typeof globalThis & { __ppTmpReports?: Map<string, ReportRow> };
const store = (g.__ppTmpReports ??= new Map<string, ReportRow>());

export const isTmpId = (id: string) => id.startsWith("tmp-");

export function putTmpReport(
  data: Omit<ReportRow, "id" | "createdAt">
): string {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  const id = `tmp-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  store.set(id, { ...data, id: 0, createdAt: new Date() });
  return id;
}

export function getTmpReport(id: string): ReportRow | null {
  const row = store.get(id);
  if (!row) return null;
  if (Date.now() - row.createdAt.getTime() > TTL_MS) {
    store.delete(id);
    return null;
  }
  return row;
}
