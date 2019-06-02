const path = require('path');
global.__basedir = __dirname;
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');

const errorController = require('./app/controllers/error');
const sequelize = require('./app/util/database');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'app/views');

/**ROUTES */
const homeRoutes = require('./app/routes/home');
const adminRoutes = require('./app/routes/admin')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(homeRoutes);
app.use('/admin', adminRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(errorController.get404);

sequelize.sync() //Creates tables in DB based on the models || Use {force: true} to reset all tables
    .then(result => {
        console.log('CONNECTION TO DATABASE SUCCESFUL');
        app.listen(3000);
        console.log('Listening on port 3000');
    })
    .catch(err => console.log(err));