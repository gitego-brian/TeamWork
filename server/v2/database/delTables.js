import dotenv from 'dotenv';
import { deleteTables } from './dbQueries';
import pool from './dbConnect';

dotenv.config();

const delTables = () => {
	pool.query(deleteTables, (error, res) => {
		if (error) {
			console.log(`error: ${error}`);
		} else {
			console.log('deleted');
		}
	});
};

delTables();
