exports.getFunctions = (req, res, next) => {
    res.render('functions/functions', {
        pageTitle: 'Puggy Wrap API - Functions',
        path: '/functions',
        isAuthenticated: true
    });
};