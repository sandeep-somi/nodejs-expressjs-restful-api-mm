const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email }).exec().then(user => {
    if (user.length) {
      return res.status(409).json({
        message: "Email already exists!"
      })
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          })
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          })
          user.save().then(result => {
            res.status(201).json({
              message: 'Signed up successfully'
            })
          }).catch(error => {
            res.status(500).json({
              error: error
            })
          })
        }

      });
    }
  });
};

exports.getAllUsers = (req, res, next) => {
  User.find().select('email _id').exec().then(users => {
    res.status(200).json({
      count: users.length,
      users: users
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
}

exports.login = (req, res, next) => {
  User.find({ email: req.body.email }).exec().then(users => {
    if (!users.length) {
      return res.status(401).json({
        message: "Auth failed!"
      })
    }
    bcrypt.compare(req.body.password, users[0].password, (er, resp) => {
      if (er) {
        return res.status(401).json({
          message: "Auth failed!"
        })
      }
      if (resp) {
        const token = jwt.sign({
          email: users[0].email,
          id: users[0]._id
        },
          process.env.JWT_KEY,
          {
            expiresIn: '1h'
          })
        return res.status(200).json({
          message: "Auth successfull!",
          token: token
        })
      }
      res.status(401).json({
        message: "Auth failed!"
      })
    })
  }).catch(err => {
    console.log(err, 'err');
    res.status(500).json({
      error: err
    })
  })
}

exports.delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId }).exec().then(result => {
    res.status(200).json({
      message: "User has been deleted successfully"
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
}