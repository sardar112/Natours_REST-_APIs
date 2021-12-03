const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouts = require('./src/routes/tourRoutes');

//APLICATION MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//ROUTES
app.use('/api/v1/tours', tourRouts);

//WILDE CARD ROUTES
app.use('**', (req, res) => {
  res.json({
    status: 404,
    message: 'Page Not Found',
  });
});

module.exports = app;
