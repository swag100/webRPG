const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');

// dot env config
const dotenv = require('dotenv');
dotenv.config();

//get routers
let indexRouter = require('./routes/index');
let authRouter = require('./routes/auth');

//app stuff
const app = express();

//awesome
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
/*app.use(session({
    secret: 'apple',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}/session store options/, db)
}));
app.use(passport.authenticate('session'));*/
app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}/`);
})

//USE our routers!
app.use('/', indexRouter);
app.use('/', authRouter);