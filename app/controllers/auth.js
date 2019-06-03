exports.authFuntion = (req, res, next) => {
    res.render('login/login', {
        pageTitle: 'Puggy Wrap API - Login',
        path: '/login',
        isAuthenticated: true
    });
};