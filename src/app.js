'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
const Cpf = require('./models/cpf');
const Assinatura = require('./models/assinaturas');

const productRoute = require('./routes/product-route');
const indexRoute = require('./routes/index-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');
const cpfRoute = require('./routes/cpf-router');
const AssinaturaRoute = require('./routes/assinaturas-route');


app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);

app.use('/assinatura', AssinaturaRoute);

app.use('/cpf', cpfRoute);

app.use('/orders', orderRoute);

module.exports = app;