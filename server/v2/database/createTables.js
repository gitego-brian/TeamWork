import createTables from './dbQueries';
import pool from './dbConnect';

pool.query(createTables, (_error, _res) => {
	if (_error) {
		console.error(_error);
	}
	console.table(_res.rows);
	pool.end();
});
pool.connect();

export default pool;
