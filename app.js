const express = require('express');

// dot env config
const dotenv = require('dotenv');
dotenv.config();

//get routers
let indexRouter = require('./routes/index');
let authRouter = require('./routes/auth');

//app stuff
const app = express();

//awesome
app.set('view engine', 'pug');
app.use(express.static('public'));
app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
})

//USE our routers!
app.use('/', indexRouter);
app.use('/', authRouter);