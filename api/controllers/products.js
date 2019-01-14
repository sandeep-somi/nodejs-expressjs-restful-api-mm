const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getAllProducts = (req, res, next) => {
  Product.find().select('name price _id asset').exec().then(result => {
    res.status(200).json({
      count: result.length,
      values: result.map(item => ({
        name: item.name,
        price: item.price,
        id: item._id,
        asset: item.asset,
        request: {
          type: 'GET',
          link: 'http://localhost:8000/products/' + item._id
        }
      }))
    })
  }).catch(err => {
    res.status(500).json(err)
  })
}

exports.createProduct = (req, res, next) => {
  console.log(req.body, 'req.body');
  const { name, price } = req.body;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    asset: req && req.file && req.file.path
  })

  product.save().then(result => {
    console.log(result, 'result');
    res.status(201).json({
      message: 'Product created successfully!',
      product: {
        id: result._id,
        name: result.name,
        price: result.price,
        asset: result.asset,
        request: {
          type: 'GET',
          link: 'http://localhost:8000/products/' + result._id
        }
      }
    })
  }).catch(err => {
    res.status(500).json({ error: err })
  })
}

exports.getProductById = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId).select('_id name price asset').exec().then(result => {
    if (result) {
      res.status(200).json({
        id: result._id,
        name: result.name,
        price: result.price,
        asset: result.asset,
        request: {
          type: 'GET',
          link: 'http://localhost:8000/porducts/' + result._id
        }
      })
    } else {
      res.status(404).json({
        error: {
          message: 'Product not found!'
        }
      })
    }
  }).catch(err => {
    res.status(500).json(err)
  })
}

exports.updateProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.updateOne({ _id: productId }, { $set: { name: req.body.name, price: req.body.price } }).exec().then(result => {
    console.log(esult, 'result');
    
    Product.findById(productId).select('_id name price asset').exec().then(product => {
      res.status(200).json({
        name: product.name,
        id: product._id,
        price: product.price,
        asset: product.asset
      })
    }).catch(err => {
      res.status(500).json({ error: err })  
    })
  }).catch(err => {
    res.status(500).json({ error: err })
  })
}

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.productId }).exec().then(result => {
    res.status(200).json({ message: 'Product has been deleted successfully!' })
  }).catch(err => {
    res.status(500).json(err)
  })
}