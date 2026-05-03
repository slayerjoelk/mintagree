import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "mintagree.db");

if (!fs.existsSync(DB_PATH)) {
  console.error("Database file not found:", DB_PATH);
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

type Migration = {
  id: string;
  sql: string;
};

const migrations: Migration[] = [
  {
    id: "2025-01-15-add-receipts-channel",
    sql: `ALTER TABLE receipts ADD COLUMN channel TEXT DEFAULT 'email';`,
  },
  {
    id: "2025-01-15-add-clients-phone",
    sql: `ALTER TABLE clients ADD COLUMN phone TEXT;`,
  },
  {
    id: "2025-01-15-add-clients-channel",
    sql: `ALTER TABLE clients ADD COLUMN channel TEXT DEFAULT 'email';`,
  },
  {
    id: "2025-01-15-add-clients-whatsapp-opt-in",
    sql: `ALTER TABLE clients ADD COLUMN whatsapp_opt_in INTEGER DEFAULT 0;`,
  },
  {
    id: "2025-01-15-create-conversation-threads",
    sql: `CREATE TABLE IF NOT EXISTS conversation_threads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      client_phone TEXT NOT NULL,
      client_name TEXT,
      client_email TEXT,
      source TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      draft_receipt_id TEXT,
      last_message_at INTEGER,
      message_count INTEGER DEFAULT 0,
      ai_summary TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );`,
  },
  {
    id: "2025-01-15-create-messages",
    sql: `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL REFERENCES conversation_threads(id) ON DELETE CASCADE,
      direction TEXT NOT NULL,
      "from" TEXT NOT NULL,
      "to" TEXT NOT NULL,
      body TEXT NOT NULL,
      media_url TEXT,
      twilio_sid TEXT,
      ai_processed INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );`,
  },
  {
    id: "2025-01-15-create-receipt-delivery",
    sql: `CREATE TABLE IF NOT EXISTS receipt_delivery (
      id TEXT PRIMARY KEY,
      receipt_id TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
      channel TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      external_id TEXT,
      error TEXT,
      sent_at INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );`,
  },
  {
    id: "2025-01-15-create-conversation-threads-index",
    sql: `CREATE INDEX IF NOT EXISTS idx_threads_user ON conversation_threads(user_id);`,
  },
  {
    id: "2025-01-15-create-messages-index",
    sql: `CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);`,
  },
  {
    id: "2025-01-15-add-conversation-threads-subject",
    sql: `ALTER TABLE conversation_threads ADD COLUMN subject TEXT;`,
  },
];

// Simple migration tracking table
db.exec(`CREATE TABLE IF NOT EXISTS _migrations (
  id TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL DEFAULT (unixepoch())
)`);

const applied = new Set(
  db.prepare("SELECT id FROM _migrations").all().map((r: any) => r.id)
);

for (const m of migrations) {
  if (applied.has(m.id)) {
    console.log(`  SKIP  ${m.id}`);
    continue;
  }
  try {
    db.exec(m.sql);
    db.prepare("INSERT INTO _migrations (id) VALUES (?)").run(m.id);
    console.log(`  OK    ${m.id}`);
  } catch (err) {
    console.error(`  FAIL  ${m.id}:`, err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

console.log("Migration complete.");
db.close();
console.log("Database connection closed.");
