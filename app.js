var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let bluebird = require('bluebird');
let mongoose = require('mongoose');

let {seedDb} = require('./helper/seedDb');

let orderRouter = require('./routes/order');
let userRouter = require('./routes/users');
let indexRouter = require('./routes/index');
let utilRouter = require('./routes/utils.routes');

var app = express();

setUpMongo();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const setupHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
};


app.all('*', setupHeaders);

app.use('/', indexRouter);

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/utils', utilRouter);
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function setUpMongo() {
    mongoose.Promise = bluebird;
    let mongoOptions = {
        useNewUrlParser: true
    };
    mongoose.connect(`mongodb://localhost/deved`, mongoOptions);

    mongoose.connection.on('error', (err) => {
        console.error(`Mongodb connection error ${err}`);
        process.exit(-1);
    });

    seedDb();
}