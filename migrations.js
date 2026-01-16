import sqlite3 from 'sqlite3';

const dbName = 'db.sqlite';

const SQLQueries = {
    // CATEGORY
    chat_id: `
    CREATE TABLE IF NOT EXISTS chatId
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId TEXT NOT NULL UNIQUE
    )
    `,
    // QUOTE
    quote: `
    CREATE TABLE IF NOT EXISTS quote
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    text TEXT NOT NULL, 
    chatIdKey TEXT NOT NULL,
    sender TEXT
    )
    `,
    // ADD SENDER COLUMN
    add_sender_column: `ALTER TABLE quote ADD COLUMN sender TEXT`,
};

const db = new sqlite3.Database(dbName);

Object.entries(SQLQueries).forEach(async ([name, SQLQuery]) => {
    try {
        console.log('\x1b[34m', name);
        db.run(SQLQuery);
        console.log('\x1b[32m', 'completed');
        console.log('\x1b[0m', '');
    } catch (e) {
        console.log('\x1b[31m', 'error:' + e);
    }
});
db.close();
console.log('\x1b[32m', 'FULL COMPLETED');
console.log('\x1b[0m', '');
