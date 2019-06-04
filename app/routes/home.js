const express = require('express');

const homeController = require('../controllers/home');
//Middleware to only acces route if user is signed in
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/getting_started', homeController.getGetStarted);
router.get('/download/:functionID', homeController.getFunctionFile);
router.get('/fn-:functionID', homeController.getFunctionCode);
router.get('/basic_import', homeController.getBasicImport);

module.exports = router;