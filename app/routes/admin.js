const express = require('express');

const adminController = require('../controllers/admin');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/functions', adminController.getFunctions);

router.get('/add_function', adminController.getAddFunction);
router.post('/add_function', adminController.postAddFunction);

router.get('/single_function', adminController.getSingleFunction);

router.get('/details/:functionID', adminController.getFunctionDetails);

module.exports = router;