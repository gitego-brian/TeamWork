import dotenv from 'dotenv';
import { deleteTables } from './dbQueries';
import pool from './dbConnect';

dotenv.config();

const delTables = async () => {
	await pool.query(deleteTables).then((res) => console.log(res)).catch((err) => console.log(err));
};

delTables();
