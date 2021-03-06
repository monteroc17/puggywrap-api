const express = require('express');

const adminController = require('../controllers/admin');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/functions', isAuth, adminController.getFunctions);
router.get('/my_functions', isAuth, adminController.getMyFunctions);
router.get('/add_function', isAuth, adminController.getAddFunction);
router.post('/add_function', isAuth, adminController.postAddFunction);

router.get('/edit_function/:functionID', isAuth, adminController.getEditFunction);
router.post('/edit_function', isAuth, adminController.postEditFunction);

router.get('/details/:functionID', adminController.getFunctionDetails);

module.exports = router;