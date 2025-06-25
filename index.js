const express = require('express');
const app = express();

// dot env config
const dotenv = require('dotenv');
dotenv.config();

//get connection
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

//awesome
app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
})
app.get('/', (req, res) => {
    res.render('index', { message: 'Hello there!' });
});

//WE CAN QUERY THE DATABASE WOOOHOOOO
/*
connection.connect();
connection.query("SELECT * FROM user", (err, rows, fields) => {
    if (err) throw err;

    console.log('The solution is: ', rows[0]);
});
connection.end();
*/