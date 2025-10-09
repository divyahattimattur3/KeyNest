const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'keynest',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify for async/await usage
const promisePool = pool.promise();

module.exports = promisePool;
