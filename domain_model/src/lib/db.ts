import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || 'postgresql://localhost:5432/albergue',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
