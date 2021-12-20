const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRoutes = require('./src/routes/tourRoutes');
const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controllers/errorControllers');
const userRoutes = require('./src/routes/userRoutes');
//APLICATION MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
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
