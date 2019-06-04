const User = require('../models/user');
const passwordGenerator = require('password-generator');

exports.getLogin = (req, res, next) => {
    res.render('login/login', {
        pageTitle: 'Puggy Wrap API - Login',
        path: '/login',
        isAuthenticated: false
    });
};


exports.postLogin = async(req, res, next) => {
    const { id, name, username } = req.body;
    const password = passwordGenerator(12, false);
    const user = await User.create({ id, name, username, password: id });
    if (!user) {
        throw new Error('Error al crear usuario!');
    }
    res.redirect('/admin/functions');
};