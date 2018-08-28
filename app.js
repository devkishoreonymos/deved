var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let bluebird = require('bluebird');
let mongoose = require('mongoose');

let orderRouter = require('./routes/order');
let userRouter = require('./routes/users');
let indexRouter = require('./routes/index');

var app = express();

setUpMongo();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

app.use('/api/users', userRouter);

app.use('/api/orders', orderRouter);
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
    mongoose.connect(`mongodb://localhost:27017/deved`, mongoOptions, () => {
        mongoose.connection.db.dropDatabase();
    });

    mongoose.connection.on('error', (err) => {
        console.error(`Mongodb connection error ${err}`);
        process.exit(-1);
    });
}