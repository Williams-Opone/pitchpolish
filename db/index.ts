import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString:
    databaseUrl || "postgresql://postgres:postgres@localhost:5432/postgres",
});

export const db = drizzle(pool, { schema });