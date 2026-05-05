import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function run() {
  try {
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    console.log("TABLES:", tables.rows.map((r) => r.name).join(","));

    const infoUsers = await client.execute("PRAGMA table_info(users)");
    console.log("USERS_COLS:", infoUsers.rows.map((r) => (r as any).name).join(","));

    const infoReceipts = await client.execute("PRAGMA table_info(receipts)");
    console.log("RECEIPTS_COLS:", infoReceipts.rows.map((r) => (r as any).name).join(","));

    const newUsers = await client.execute(
      "SELECT count(*) as c FROM users WHERE created_at > datetime('now', '-1 day')"
    );
    console.log("NEW_USERS_24H:", (newUsers.rows[0] as any).c);

    const totalUsers = await client.execute("SELECT count(*) as c FROM users");
    console.log("TOTAL_USERS:", (totalUsers.rows[0] as any).c);

    const newReceipts = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE created_at > datetime('now', '-1 day')"
    );
    console.log("NEW_RECEIPTS_24H:", (newReceipts.rows[0] as any).c);

    const totalReceipts = await client.execute("SELECT count(*) as c FROM receipts");
    console.log("TOTAL_RECEIPTS:", (totalReceipts.rows[0] as any).c);

    const signed = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE signed_at > datetime('now', '-1 day')"
    );
    console.log("SIGNED_24H:", (signed.rows[0] as any).c);

    const disputed = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE disputed = 1 AND updated_at > datetime('now', '-1 day')"
    );
    console.log("DISPUTED_24H:", (disputed.rows[0] as any).c);

    const payfast = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%pay%%'"
    );
    console.log("PAYFAST_TABLES:", payfast.rows.map((r) => r.name).join(",") || "NONE");

    console.log("DONE");
  } catch (e: any) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
}

run();
