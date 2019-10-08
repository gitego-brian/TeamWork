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
const configTest = {
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_TEST_DB,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT
};
// eslint-disable-next-line import/no-mutable-exports
let pool;
if (process.env.NODE_ENV === 'testing') {
	pool = new Pool(configTest);
	pool.connect(() => console.log('testing...'));
} else {
	pool = new Pool(config);
	pool.connect(() => console.log('connected...'));
}

export default pool;
