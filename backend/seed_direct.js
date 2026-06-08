const { Client } = require('pg');

async function main() {
  // Use the local docker port mapping 5433 that was specified earlier.
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5433/clubsync',
  });

  try {
    await client.connect();
    console.log('Connected to DB.');
    
    await client.query(`
      INSERT INTO colleges (id, name, domain, "updatedAt") 
      VALUES ('college_123', 'Test College', 'college.edu', NOW()) 
      ON CONFLICT (id) DO NOTHING;
    `);
    
    console.log('Dummy college seeded successfully!');
  } catch (err) {
    console.error('Error seeding college:', err);
  } finally {
    await client.end();
  }
}

main();
