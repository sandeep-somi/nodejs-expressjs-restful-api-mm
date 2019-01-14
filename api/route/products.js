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
const productsController = require('../controllers/products');

router.get('/', productsController.getAllProducts);
router.post('/', upload.single('asset'), checkAuth, productsController.createProduct);
router.get('/:productId', productsController.getProductById);
router.patch('/:productId', checkAuth, productsController.updateProduct);
router.delete('/:productId', checkAuth, productsController.deleteProduct);

module.exports = router;