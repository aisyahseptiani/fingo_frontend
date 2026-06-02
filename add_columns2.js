import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "notifications" JSONB,
      ADD COLUMN IF NOT EXISTS "preferences" JSONB;
    `);
    console.log("Columns added successfully");
  } catch (err) {
    console.error("Error adding columns:", err);
  } finally {
    await pool.end();
  }
}

run();
