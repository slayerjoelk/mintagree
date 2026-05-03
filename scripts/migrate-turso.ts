import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing DATABASE_URL or TURSO_AUTH_TOKEN env vars");
  process.exit(1);
}

const client = createClient({ url, authToken });

function splitStatements(sql: string): string[] {
  return sql
    .split(/;/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

const migrations: { id: string; sql: string }[] = [
  {
    id: "0000-base-schema",
    sql: `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  email text NOT NULL,
  name text,
  company text,
  plan text DEFAULT 'free',
  email_verified integer DEFAULT false,
  created_at integer NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);

CREATE TABLE IF NOT EXISTS receipts (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  token text NOT NULL,
  subject text NOT NULL,
  bullets text NOT NULL,
  amount real,
  currency text DEFAULT 'USD',
  due_date text,
  client_email text,
  client_name text,
  require_otp integer DEFAULT true,
  otp text,
  status text DEFAULT 'sent',
  scheduled_at text,
  created_at integer NOT NULL,
  updated_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS receipts_token_unique ON receipts (token);

CREATE TABLE IF NOT EXISTS clients (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  email text NOT NULL,
  name text,
  company text,
  created_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS clients_user_email_idx ON clients (user_id, email);

CREATE TABLE IF NOT EXISTS templates (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  name text NOT NULL,
  subject text,
  bullets text NOT NULL,
  amount real,
  industry text,
  created_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS signatures (
  id text PRIMARY KEY NOT NULL,
  receipt_id text NOT NULL,
  client_email text NOT NULL,
  client_name text,
  action text NOT NULL,
  otp_used text,
  ip text,
  created_at integer NOT NULL,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attachments (
  id text PRIMARY KEY NOT NULL,
  receipt_id text NOT NULL,
  filename text NOT NULL,
  url text NOT NULL,
  mime_type text,
  scheduled_at text,
  created_at integer NOT NULL,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);
    `,
  },
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
      subject TEXT,
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
];

async function run() {
  // Create _migrations tracking table
  await client.execute(`CREATE TABLE IF NOT EXISTS _migrations (id TEXT PRIMARY KEY, applied_at INTEGER NOT NULL DEFAULT (unixepoch()))`);

  const res = await client.execute("SELECT id FROM _migrations");
  const applied = new Set(res.rows.map((r: any) => r.id));

  for (const m of migrations) {
    if (applied.has(m.id)) {
      console.log(`  SKIP  ${m.id}`);
      continue;
    }
    const stmts = splitStatements(m.sql);
    for (const stmt of stmts) {
      try {
        await client.execute(stmt);
      } catch (err: any) {
        // Ignore "already exists" errors for CREATE TABLE/INDEX IF NOT EXISTS
        if (/already exists|duplicate|existing/.test(err.message || "")) {
          console.log(`  NOTE  ${m.id}: ${err.message}`);
        } else {
          console.error(`  FAIL  ${m.id}:`, err.message || err);
          process.exit(1);
        }
      }
    }
    await client.execute({ sql: "INSERT INTO _migrations (id) VALUES (?)", args: [m.id] });
    console.log(`  OK    ${m.id}`);
  }

  console.log("\nMigration complete. All tables live on Turso.");
  await client.close();
}

run().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
