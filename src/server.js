const express = require('express');
const app = express();

const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const routes = require('./routes/routes');

// Connections
mongoose.connect('mongodb://localhost:27017/UsersTest',{ useNewUrlParser: true })
        .then(db=> console.log('DB Connected') )
        .catch(err=> console.log('Fallo a conectar la base de datos', err) );
        
require('./config/passport')(passport);


// config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views') );
app.set('view engine', 'ejs' );


//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    secret:'nichollsLedesma',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', express.static(__dirname + '/../public'));

// routes
// app.use('/', routes);
require('./routes/routes')(app, passport);

app.listen(app.get('port'), ()=>{
    console.log( 'Escuchando en el puerto: ' + app.get('port') );
    
});