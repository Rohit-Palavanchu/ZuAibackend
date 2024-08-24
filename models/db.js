const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../blogs.db'); 

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to the database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS USERS(
        id VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS BLOGS(
        id VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        last_modified DATETIME NOT NULL,
        FOREIGN KEY (username) REFERENCES USERS(username)
    )`);
});


module.exports = db;
