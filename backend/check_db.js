const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Pool } = require('pg'); 
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_B1JxMNTULO5I@ep-purple-sky-ah0a713j-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' }); 

pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'", (err, res) => { 
  console.log(res ? res.rows : err); 
  pool.end(); 
});
