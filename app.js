var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var session = require('express-session');

var requireDir = require('require-dir');
var passport = require('passport');
var authRoutes = require('./routes/auth');
var usrRoutes = require('./routes/usuario');

// Conectamos a la base de datos
mongoose.connect('mongodb://10.1.62.17/andes');

// Se crea la aplicación Express
var app = express();

//Se usa el package body-parser en la aplicación
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Usar soporte express session desde OAuth2orize
// app.use(session({
//   secret: 'Super Secret Session Key',
//   saveUninitialized: true,
//   resave: true
// }));

// Se usa el package passport en nuestra aplicación
app.use(passport.initialize());

// Crear nuestro router Express
//var router = express.Router();


//***DESPUES SE CONFIGURARÍA DE LA MISMA FORMA LAS RUTAS DE LAS APIS
app.use('/', authRoutes.autenticado, usrRoutes );   //Se configuran las rutas con autenticación

//SE CONFIGURAN CON AUTENTICACIÓN
//app.use('/', usrRoutes );   //Sin autenticación

// var routes = requireDir('./routes/');
// for (var route in routes)
//     //app.use('/', authRoutes.autenticado, routes[route]);
//       app.use('/apiAuth', routes[route]);

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
