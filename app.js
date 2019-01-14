const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const productRoutes = require('./api/route/products');
const orderRoutes = require('./api/route/orders');
const userRoutes = require('./api/route/users');

mongoose.connect(config.connectURI, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  res.header('Access-Contorl-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS') {
    res.header('Access-Contol-Allow-Methods', 'PUT, POST, PATCH, PUT, DELETE');
    return res.status(200).json();
  }
})


app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;