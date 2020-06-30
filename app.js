const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fieldSize: 1024 * 1024 * 1024 }
});
const jwtAuth = require('./lib/jwtAuth');
const i18n = require('./lib/i18n-configure')();

const app = express();

require('./lib/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3001']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/*
  * i18n setup
*/
app.use(i18n.init);

/*
  * Global variable within views
*/
app.locals.title = 'Nodepop';

/*
  * API Routes
*/


app.use('/api/ads', upload.single('thumbnail'), jwtAuth(), require('./routes/api/ads'));
app.use('/api/authenticate', require('./routes/api/authenticate'));

/*
  * Website routes
*/
app.use('/', require('./routes/index'));
app.use('/tags', require('./routes/tags'));
app.use('/change-locale', require('./routes/change-locale'));

//! catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

/*
  ? Function that checks whether the request comes from the API or the Website
*/
const isApiRequest = req => {
  return req.originalUrl.startsWith('/api/');
};

//! error handler
app.use(function (err, req, res, next) {

  if (isApiRequest(req)) {
    return res.json({ status: err.status, message: err.message });
  }

  //? set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status;
  res.locals.errors = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
