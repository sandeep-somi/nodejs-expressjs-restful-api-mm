const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


router.get('/', (req, res, next) => {
  Order.find().select('productId quantity _id').exec().then(result => {
    res.status(200).json({
      count: result.length,
      values: result.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        id: item._id,
        request: {
          type: 'GET',
          link: 'http://localhost:8000/orders' + item._id
        }
      }))
    })

  }).catch(err => {
    res.status(500).json({err})
  })
})

router.post('/', (req, res, next) => {
  const { productId, quantity } = req.body;
  Product.findById(productId).select('_id name price').then(product => {
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      productId,
      quantity
    });
  
    order.save().then(result => {
      res.status(201).json({
        id: result._id,
        productId: result.productId,
        quantity: result.quantity,
        product: product
      })
    }).catch(err => {
      res.status(500).json(err);
    })
    
  }).catch(err => {
    res.status(500).json({
      message: "Product not found!",
      id: productId,
      error: err
    })
  });
})

router.get('/:orderId', (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId).then(result => {
    if (!result) {
      res.status(200).json({
        id: orderId,
        error: {
          message: 'Order not found!'
        }
      })  
    } else {
      res.status(200).json({
        id: result._id,
        productId: result.productId,
        quantity: result.quantity
      })
    }
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

router.patch('/:orderId', (req, res, next) => {
  const { orderId } = req.params;
  Order.update({ _id: orderId }, { $set: { quantity: req.body.quantity } }).then(resp => {
    Order.findById(orderId).then(result => {
      res.status(200).json({
        id: result._id,
        productId: result.productId,
        quantity: result.quantity
      })
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

router.delete('/:orderId', (req, res, next) => {
  const { orderId } = req.params;
  Order.deleteOne({ _id: orderId }).then(result => {
    res.status(200).json({
      message: 'Order has been deleted successfully!'
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  }) 
})

module.exports = router;