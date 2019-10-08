import { Pool } from 'pg';
import dotenv from 'dotenv';
import createTables from './dbQueries';

dotenv.config();

const config = {
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DB,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT
};

const pool = new Pool(config);
pool.query(createTables, (error, res) => {
	if (error) {
		console.log(`error: ${error}`);
	} else {
		console.log('connected to database');
	}
});
pool.connect();
export default pool;
