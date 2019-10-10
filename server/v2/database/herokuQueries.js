import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => {
	console.log(err);
});
const createHerokuTables = pool.query(`
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    gender TEXT NOT NULL,
    jobRole TEXT NOT NULL,
    department TEXT NOT NULL,
    address TEXT NOT NULL,
    isAdmin BOOLEAN DEFAULT false
  );
CREATE TABLE IF NOT EXISTS articles (
    id serial PRIMARY KEY,
    authorId INTEGER REFERENCES users (id),
    authorName TEXT,
    title TEXT NOT NULL,
    article TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
CREATE TABLE IF NOT EXISTS articleFlags (
    id SERIAL PRIMARY KEY UNIQUE,
    authorId INTEGER NOT NULL REFERENCES users (id),
    articleId INTEGER NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    flaggedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY UNIQUE,
    authorId INTEGER,
    articleId INTEGER NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    postedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE IF NOT EXISTS commentFlags (
    id SERIAL PRIMARY KEY UNIQUE,
    authorId INTEGER,
    commentId INTEGER NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    flaggedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

export default createHerokuTables;
