const express = require('express');
const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongooseSanitize = require('express-mongoose-sanitize');
const app = express();

const tourRoutes = require('./src/routes/tourRoutes');
const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controllers/errorControllers');
const userRoutes = require('./src/routes/userRoutes');
//APLICATION MIDDLEWARE
//set security http headers
app.use(helmet());
//development server
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit some api
const limitter = rateLimit;
({
  max: 100,
  windowMS: 60 * 6 * 1000,
  message: 'Too many request , please try again in an hour later.',
});
app.use('/api', limitter);
//reading data from body  into req.body
app.use(express.json({ limit: '10kb' }));
//data sanitization against nosql query injection
app.use(mongooseSanitize());
//data sanitization against xss
app.use(xss());
//prevent params pollution
app.use(hpp({ whitelist: ['name', 'averageRating', 'price'] })); //whitelist allows u to send two same fields for sorting
//serving static files
app.use(express.static(`${__dirname}/public`));

//ROUTES
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

//WILDE CARD ROUTES
app.use('**', (req, res, next) => {
  // old practice
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // newPractice v1
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 404;
  // next(err);

  // newPractice v2
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//global error handling MIDDLEWARE
app.use(globalErrorHandler);
module.exports = app;
