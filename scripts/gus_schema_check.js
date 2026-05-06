const { createClient } = require("@libsql/client");
const c = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
(async () => {
  const r = await c.execute("PRAGMA table_info(receipts)");
  for (const row of r.rows) console.log(row.name, row.type);
  const s = await c.execute("PRAGMA table_info(signatures)");
  console.log("SIGNATURES:");
  for (const row of s.rows) console.log(row.name, row.type);
})();
