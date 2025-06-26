const mysql = require('mysql2');

// dot env config
const dotenv = require('dotenv');
dotenv.config();

//short
const DB_NAME = process.env.DB_NAME;

//WE CAN QUERY THE DATABASE WOOOHOOOO
//get connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD
});

//this just prevents repetition
function attempt(sql){
    connection.query(sql, (err) => { if (err) throw err; });
}

//create db structure if not exists
//"Sock" Drawer; "User" Table
connection.connect();
attempt(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET utf8;`);
attempt(`USE ${DB_NAME};`);
attempt(
    `CREATE TABLE IF NOT EXISTS ${DB_NAME}.user (
        user_id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(16) NOT NULL,
        email VARCHAR(255) NULL,
        password VARCHAR(32) NOT NULL,
        create_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id)
    );`
);
connection.end();

module.exports = connection;