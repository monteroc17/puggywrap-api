exports.getGetStarted = (req, res, next) => {
    res.render('getting_started/getting_started', {
        pageTitle: 'Puggy Wrap API - Getting Started',
        path: '/getting_started',
        isAuthenticated: true
    });
};