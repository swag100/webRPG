const express = require('express');
const session = require('express-session');
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
app.use(session({
    secret: process.env.SESS_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('public'));

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
})
app.get('/', (req, res) => {
    res.render('index', { message: 'Hello there!' });
});

//WE CAN QUERY THE DATABASE WOOOHOOOO
/*connection.connect();
connection.query("SELECT * FROM user", (err, rows, fields) => {
    if (err) throw err;

    console.log('The solution is: ', rows[0]);
});
connection.end();*/
//useing sessions
/*app.post('/get-data', (req, res) => {
    const username = req.session.username;
    const loggedIn = req.session.loggedIn;
    res.send(`Username: ${username}, Logged In: ${loggedIn}`);
});*/

/* Some Interesting Thoughts To Consider */
/*
Clients send INPUTS to the server, and the server does the logic for every player
Prevents clients from hacking, but seems intense on server

Also, where would a good place be for game server logic?
Like how would i make it ONLY be happening on pages with a canvas?
*/