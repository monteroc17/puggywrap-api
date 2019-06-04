const express = require('express');

const authController = require('../controllers/auth.js');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/signin', authController.getSignin);
router.post('/signin', authController.postSignin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

module.exports = router;