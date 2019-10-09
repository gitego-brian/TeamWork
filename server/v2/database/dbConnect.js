import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DB,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT
};
// eslint-disable-next-line import/no-mutable-exports
const pool = new Pool(config);
pool.connect(() => console.log('connected...'));

export default pool;
