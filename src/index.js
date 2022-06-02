const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const route = require('./routes');
const db = require('./config/db');

// Connect to db
db.connect();

// Template engine
app.engine('hbs', handlebars({
	extname: '.hbs',
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

// Routes init
route(app);

app.listen(port);
