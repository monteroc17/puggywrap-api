const express = require('express');

const homeController = require('../controllers/home');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();





module.exports = router;