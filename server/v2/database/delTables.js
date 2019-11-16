import dotenv from 'dotenv';
import { deleteTables } from './dbQueries';
import pool from './dbConnect';

dotenv.config();

const delTables = async () => {
  try {
    await pool.query(deleteTables);
    process.exit(0);
  } catch (e) {
    console.log(e);
  }
};

delTables();
