
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const userController = require('../controllers/users');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/:userId', userController.delete);

// router.get('/', (req, res, next) => {
//   User.find().select('email _id').exec().then(users => {
//     res.status(200).json({
//       count: users.length,
//       users: users
//     })
//   }).catch(err => {
//     res.status(500).json({
//       error: err
//     })
//   })
// })

module.exports = router