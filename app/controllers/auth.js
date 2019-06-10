const User = require('../models/user');

exports.getSignup = (req, res, next) => {
    res.render('login/signup', {
        pageTitle: 'Puggy Wrap API - Sign Up',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getSignin = (req, res, next) => {
    res.render('login/signin', {
        pageTitle: 'Puggy Wrap API - Sign In',
        path: '/signin',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postSignup = async(req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const newUser = await User.create({ name, email, password });
        if (!newUser) {
            throw new Error('Error al crear usuario!');
        }
        req.session.user = newUser;
        req.session.isLoggedIn = true;
        res.redirect('/admin/functions');
    } else {
        res.redirect('/signin');
        alert('El usuario ya existe!');
    }
};

exports.postSignin = async(req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
        alert('El usuario no existe!');
        res.redirect('/signup');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect('/admin/functions');
};

exports.postLogout = async(req, res, next) => {
    req.session.isLoggedIn = false;
    req.session.user = null;
    console.log('in post logout', req.session.isLoggedIn);
    res.clearCookie("G_AUTHUSER_H");
    res.clearCookie("G_ENABLED_IDPS");
    res.redirect('/getting_started');
};