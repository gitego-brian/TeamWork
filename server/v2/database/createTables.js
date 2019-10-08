import createTables from './dbQueries';
import pool from './dbConnect';

const makeTables = async () => {
	await pool.query(createTables).then((res) => console.log(res)).catch((err) => console.log(err));
};

makeTables();
