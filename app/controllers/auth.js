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
    const { id, name, email } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
        const newUser = await User.create({ id, name, email, password: id });
        if (!newUser) {
            throw new Error('Error al crear usuario!');
        }
        req.session.user = newUser;
        res.redirect('/admin/functions');
    } else {
        res.redirect('/signin');
        console.log('El usuario ya existe!');
    }
};

exports.postSignin = async(req, res, next) => {
    const id = req.body.id;
    const user = await User.findByPk(id);
    if (!user) {
        console.log('El usuario no existe!');
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