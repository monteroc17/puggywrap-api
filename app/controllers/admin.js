const ApiFunction = require('../models/function');

exports.getFunctions = (req, res, next) => {
    res.render('functions/functions', {
        pageTitle: 'Puggy Wrap API - Functions',
        path: '/functions',
        isAuthenticated: true,
        functions: [{ name: 'Calculadora', id: 'FN0100-000001' }]
    });
};

exports.postAddFunction = (req, res, next) => {
    const { name, description, function_code, tags, dependencies } = req.body;
    tags = tags.replace(/\s/g, '').split(',');
    //Add User function to db
    ApiFunction.create({
            name,
            description,
            function_code
        })
        .then(result => {
            // Add tags to db table
            //Look for dependencies

            // Render Account Page
            res.render('functions/my-functions', {
                pageTitle: 'Puggy Wrap API - My Functions',
                path: '/my_functions',
                isAuthenticated: true,
                functions: [{ name: 'Calculadora', id: 'FN0100-000001' }]
            });
        })
        .catch(err => console.log('An error occured while creating function:', err));

};