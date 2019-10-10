import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
// eslint-disable-next-line import/no-mutable-exports
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.connect(() => console.log('connected...'));

export default pool;
