const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const ordersController = require('../controllers/orders');


router.get('/', checkAuth, ordersController.getAllOrders);
router.post('/', checkAuth, ordersController.createOrder);
router.get('/:orderId', checkAuth, ordersController.getOrderById);
router.patch('/:orderId', checkAuth, ordersController.updateOrder);
router.delete('/:orderId', checkAuth, ordersController.deleteOrder);

module.exports = router;