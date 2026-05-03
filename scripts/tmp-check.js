const { createClient } = require('@libsql/client');
const client = createClient({
  url: 'libsql://mintagree-slayerjoelk.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc4MTYwNjYsImlkIjoiMDE5ZGVlMTgtMDEwMS03Y2IyLWJmMzYtNmZjNTIzZWMzMmU1IiwicmlkIjoiNmJhMDY0YzUtMjQ2ZS00OWJkLWFkOTYtMDk0NmU5Yzk4ZGEwIn0.Mcx8OlNew7VwzzbS5t8QAbojMSEgfA1iEQCzRzN6dxZ3meh03CPSAubG9TYxCkqgZ3Ys7RTFrjXw-k74FdVuAA'
});

async function run() {
  try {
    const users = await client.execute('SELECT count(*) AS c FROM users;');
    console.log('users:', users.rows[0].c);

    const receipts = await client.execute('SELECT count(*) AS c FROM receipts;');
    console.log('receipts:', receipts.rows[0].c);

    const signed = await client.execute("SELECT count(*) AS c FROM receipts WHERE status='signed';");
    console.log('signed:', signed.rows[0].c);

    const sigs = await client.execute('SELECT count(*) AS c FROM signatures;');
    console.log('signatures:', sigs.rows[0].c);

    const thr = await client.execute('SELECT count(*) AS c FROM conversation_threads;');
    console.log('threads:', thr.rows[0].c);

    const msg = await client.execute('SELECT count(*) AS c FROM messages;');
    console.log('messages:', msg.rows[0].c);

    const now = Date.now();
    const last3h = now - 3*60*60*1000;
    const last12h = now - 12*60*60*1000;

    const r3 = await client.execute(`SELECT count(*) AS c FROM receipts WHERE created_at > ${last3h};`);
    console.log('last3h:', r3.rows[0].c);

    const r12 = await client.execute(`SELECT count(*) AS c FROM receipts WHERE created_at > ${last12h};`);
    console.log('last12h:', r12.rows[0].c);
  } catch (e) {
    console.error('ERR:', e.message);
    process.exit(1);
  }
}
run();
