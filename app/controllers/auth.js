const User = require('../models/user');

exports.getSignup = (req, res, next) => {
    res.render('login/signin', {
        pageTitle: 'Puggy Wrap API - Sign Up',
        path: '/signin',
        isAuthenticated: false
    });
};

exports.getSignin = (req, res, next) => {
    res.render('login/signin', {
        pageTitle: 'Puggy Wrap API - Sign In',
        path: '/signin',
        isAuthenticated: false
    });
};

exports.postSignup = async(req, res, next) => {
    const { id, name, email } = req.body;
    const user = await User.findByPk(id);
    if (user) {
        res.redirect('/signin');
        throw new Error('El usuario ya existe!');
    }
    const newUser = await User.create({ id, name, email, password: id });
    if (!newUser) {
        throw new Error('Error al crear usuario!');
    }
    res.redirect('/admin/functions');
};

exports.postSignin = async(req, res, next) => {
    const id = req.body.id;
    const user = await User.findByPk(id);
    if (!user) {
        res.redirect('/signin');
        throw new Error('El usuario no existe!');
    }
    res.redirect('/admin/functions');
};