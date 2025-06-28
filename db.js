const crypto = require('crypto');
const zlib = require('node:zlib');
const mysql = require('mysql2')
const dotenv = require('dotenv');
dotenv.config();

//WE CAN QUERY THE DATABASE WOOOHOOOO
//get connection
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};
const connection = mysql.createConnection(options);

//Instantiate the connection
connection.connect(function (err) {
    if (err) {
        console.log(`connection Failed ${err.stack}`)
    } else {
        console.log(`connection Successful ${connection.threadId}`)
    }
});

//ensure structure
connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
connection.query(`USE ${process.env.DB_NAME};`);
connection.query(
    `CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.user (
        user_id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(16) NOT NULL,
        email VARCHAR(255) NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_salt VARCHAR(255) NOT NULL,
        create_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id),
        UNIQUE (username)
    );`
);

// set connection options (experiment!)
connection.options = options;
connection.options.database = process.env.DB_NAME;
  
// create an initial user (username: alice, password: letmein)
const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256');
connection.query('INSERT IGNORE INTO user (username, password_hash, password_salt) VALUES (?, ?, ?)', [
    'alice',
    zlib.gzipSync(JSON.stringify(hash)).toString('base64'),
    zlib.gzipSync(JSON.stringify(salt)).toString('base64')
]);

module.exports = connection;