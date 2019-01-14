
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/:userId', checkAuth, userController.delete);
// router.get('/', checkAuth, userController.getAllUsers);

module.exports = router