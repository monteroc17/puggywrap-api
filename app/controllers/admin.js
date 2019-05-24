exports.getFunctions = (req, res, next) => {
    res.render('functions/functions', {
        pageTitle: 'Puggy Wrap API - Functions',
        path: '/functions',
        isAuthenticated: true,
        functions: [{ name: 'Calculadora', id: 'FN0100-000001' }]
    });
};

exports.postAddFunction = (req, res, next) => {
    //Add User function to db
    //Look for dependencies

    // Render Account Page
    res.render('functions/my-functions', {
        pageTitle: 'Puggy Wrap API - My Functions',
        path: '/my_functions',
        isAuthenticated: true,
        functions: [{ name: 'Calculadora', id: 'FN0100-000001' }]
    });
};