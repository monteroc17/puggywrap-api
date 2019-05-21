const express = require('express');

const adminController = require('../controllers/admin');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/functions', adminController.getFunctions);



module.exports = router;