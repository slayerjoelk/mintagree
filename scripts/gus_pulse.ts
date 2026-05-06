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
    console.log("TABLES:", tables.rows.map((r: any) => r.name).join(","));

    const infoUsers = await client.execute("PRAGMA table_info(users)");
    console.log("USERS_COLS:", infoUsers.rows.map((r: any) => r.name).join(","));

    const infoReceipts = await client.execute("PRAGMA table_info(receipts)");
    console.log("RECEIPTS_COLS:", infoReceipts.rows.map((r: any) => r.name).join(","));

    const newUsers = await client.execute(
      "SELECT count(*) as c FROM users WHERE created_at > datetime('now', '-3 hours')"
    );
    console.log("NEW_USERS_3H:", (newUsers.rows[0] as any).c);

    const totalUsers = await client.execute("SELECT count(*) as c FROM users");
    console.log("TOTAL_USERS:", (totalUsers.rows[0] as any).c);

    const newReceipts = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE created_at > datetime('now', '-3 hours')"
    );
    console.log("NEW_RECEIPTS_3H:", (newReceipts.rows[0] as any).c);

    const totalReceipts = await client.execute("SELECT count(*) as c FROM receipts");
    console.log("TOTAL_RECEIPTS:", (totalReceipts.rows[0] as any).c);

    const signed = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE status = 'signed' AND updated_at > datetime('now', '-3 hours')"
    );
    console.log("SIGNED_3H:", (signed.rows[0] as any).c);

    const totalSigned = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE status = 'signed'"
    );
    console.log("TOTAL_SIGNED:", (totalSigned.rows[0] as any).c);

    const sent = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE status = 'sent'"
    );
    console.log("TOTAL_SENT:", (sent.rows[0] as any).c);

    const disputed = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE status = 'disputed'"
    );
    console.log("TOTAL_DISPUTED:", (disputed.rows[0] as any).c);

    const drafts = await client.execute(
      "SELECT count(*) as c FROM receipts WHERE status = 'draft'"
    );
    console.log("TOTAL_DRAFTS:", (drafts.rows[0] as any).c);

    const infoSign = await client.execute("PRAGMA table_info(signatures)");
    console.log("SIGNATURES_COLS:", infoSign.rows.map((r: any) => r.name).join(","));

    const infoDel = await client.execute("PRAGMA table_info(receipt_delivery)");
    console.log("DELIVERY_COLS:", infoDel.rows.map((r: any) => r.name).join(","));

    console.log("DONE");
  } catch (e: any) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
}

run();
