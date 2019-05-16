const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');


const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));



app.listen(3000);
