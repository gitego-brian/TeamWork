import { Pool } from 'pg';
import dotenv from 'dotenv';
import createTables from './dbQueries';
import pool from './dbConnect';

pool.query(createTables, (_error, _res) => {
	if (_error) {
		console.error(_error);
	}
	pool.end();
});
pool.connect();

export default pool;
