const users = `
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
  )`;
const articles = `
CREATE TABLE IF NOT EXISTS articles (
    id serial PRIMARY KEY,
    authorId INTEGER REFERENCES users (id),
    authorName TEXT,
    title TEXT NOT NULL,
    article TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
const articleFlags = `
CREATE TABLE IF NOT EXISTS articleFlags (
    id SERIAL PRIMARY KEY UNIQUE,
    authorId INTEGER NOT NULL REFERENCES users (id),
    articleId INTEGER NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    flaggedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
const comments = `
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY UNIQUE,
    authorId INTEGER,
    articleId INTEGER NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    postedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
const commentFlags = `
CREATE TABLE IF NOT EXISTS commentFlags (
    id SERIAL PRIMARY KEY UNIQUE,
    authorId INTEGER,
    commentId INTEGER NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    flaggedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
const deleteTables = ` 
    DROP TABLE IF EXISTS users cascade;
    DROP TABLE IF EXISTS articles cascade;
    DROP TABLE IF EXISTS articleFlags cascade;
    DROP TABLE IF EXISTS comments cascade;
    DROP TABLE IF EXISTS commentFlags cascade;
    `;

export default `${users}; ${articles}; ${articleFlags}; ${comments}; ${commentFlags}`;
export { deleteTables };
