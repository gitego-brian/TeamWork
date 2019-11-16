import createTables from './dbQueries';
import pool from './dbConnect';

const makeTables = async () => {
  try {
    await pool.query(createTables);
    process.exit(0);
  } catch (e) {
    console.log(e);
  }
};

makeTables();
