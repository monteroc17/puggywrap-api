const fs = require('fs');
const ApiFunction = require('');

exports.getGetStarted = (req, res, next) => {
    res.render('getting_started/getting_started', {
        pageTitle: 'Puggy Wrap API - Getting Started',
        path: '/getting_started',
        isAuthenticated: true
    });
};

exports.getFunctionCode = async(req, res, next) => {
    const functionID = req.params.functionID;
    const func =
};