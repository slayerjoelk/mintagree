import { db } from '../src/lib/db/index';
import { sql } from 'drizzle-orm';

async function healthCheck() {
  const now = new Date();
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`);
  console.log('TABLES:', tables.map((t: any) => t.name));

  const totalUsers = await db.all(sql`SELECT count(*) as cnt FROM users;`);
  const totalReceipts = await db.all(sql`SELECT count(*) as cnt FROM receipts;`);
  const totalSignatures = await db.all(sql`SELECT count(*) as cnt FROM signatures;`);
  const recentReceipts = await db.all(sql`SELECT count(*) as cnt FROM receipts WHERE created_at > ${threeHoursAgo.toISOString()};`);
  const oldReceipts = await db.all(sql`SELECT count(*) as cnt FROM receipts WHERE created_at > ${twelveHoursAgo.toISOString()};`);
  const signOffRate = await db.all(sql`
    SELECT 
      (SELECT count(*) FROM receipts WHERE status = 'signed') as signed,
      (SELECT count(*) FROM receipts) as total;
  `);

  console.log('TOTAL_USERS:', (totalUsers[0] as any)?.cnt ?? 0);
  console.log('TOTAL_RECEIPTS:', (totalReceipts[0] as any)?.cnt ?? 0);
  console.log('TOTAL_SIGNATURES:', (totalSignatures[0] as any)?.cnt ?? 0);
  console.log('RECENT_RECEIPTS_3H:', (recentReceipts[0] as any)?.cnt ?? 0);
  console.log('RECENT_RECEIPTS_12H:', (oldReceipts[0] as any)?.cnt ?? 0);
  console.log('SIGN_OFF_RATE:', signOffRate[0]);
}

healthCheck().catch(e => {
  console.error('HEALTH_ERROR:', e.message);
  process.exit(1);
});
