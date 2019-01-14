const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, null);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find().select('name price _id asset').exec().then( result => {
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
  }).catch( err => {
    res.status(500).json(err)
  })
})


router.post('/', upload.single('asset'), checkAuth, (req, res, next) => {
  const { name, price } = req.body;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    asset: req && req.file && req.file.path
  })

  product.save().then( result => {
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
  }).catch( err => {
    res.status(500).json(err)
  })
})

router.get('/:productId', (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId).select('_id name price').exec().then(result => {
    if(result) {
      res.status(200).json({
        id: result._id,
        name: result.name,
        price: result.price,
        request: {
          type: 'GET',
          link: 'http://localhost:8000/porducts/' + result._id
        }
      })
    } else {
      res.status(404).json({ error: {
        message: 'Product not found!'
      }})
    }
  }).catch(err => {
    res.status(500).json(err)
  })
})

router.patch('/:productId', checkAuth, (req, res, next) => {
  
  Product.update({_id: req.params.productId }, { $set: { name: req.body.name, price: req.body.price } }).exec().then( result => {
    res.status(200).json({
      message: 'Product has been updated successfully!',
      request: {
        type: 'GET',
        link: 'http://localhost:8000/products/' + req.params.productId
      }
    })
  }).catch(err => {
    res.status(500).json(err)
  })
})

router.delete('/:productId', checkAuth, (req, res, next) => {
  Product.deleteOne ({ _id: req.params.productId }).exec().then(result => {
    res.status(200).json({ message: 'Product has been deleted successfully!'})
  }).catch(err => {
    res.status(500).json(err)
  })
})

module.exports = router;