// migrate.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env.local manually so we don't depend on dotenv
let dbUrl = process.env.DATABASE_URL;
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      dbUrl = trimmed.slice('DATABASE_URL='.length).replace(/^["']|["']$/g, '').trim();
      break;
    }
  }
}

console.log('Connecting with DATABASE_URL:', dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'NOT FOUND');

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const client = new Client({ connectionString: dbUrl });

async function run() {
  try {
    await client.connect();
    console.log('Connected! Creating schema...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "reports" (
        "id" serial PRIMARY KEY NOT NULL,
        "deck_name" text NOT NULL,
        "file_name" text NOT NULL,
        "score" integer NOT NULL,
        "band" text NOT NULL,
        "slide_count" integer NOT NULL,
        "word_count" integer NOT NULL,
        "sections" jsonb NOT NULL,
        "red_flags" jsonb NOT NULL,
        "summary" text NOT NULL,
        "excerpt" text NOT NULL,
        "is_sample" boolean DEFAULT false NOT NULL,
        "owner" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('Successfully created "reports" and "users" tables!');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

run();