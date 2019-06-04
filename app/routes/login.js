const express = require('express');

const authController = require('../controllers/auth.js');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

module.exports = router;