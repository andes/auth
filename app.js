var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    passportConfig = require('./passport'),
    config = require('./config'),
    routes = require('./routes/routes'),
    fs = require('fs'),
    swagger = require('swagger-jsdoc');

// Connect to MongoDB
mongoose.connect(config.mongo);

// Express config
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Passport config
passportConfig();
app.use(passport.initialize());

// swagger docs
// ... initialize swagger-jsdoc
var swaggerSpec = swagger({
  swaggerDefinition: {
    basePath: '/auth'
  },
  apis: fs.readdirSync(path.join(__dirname, './routes/')).map(function(i){ return path.join(__dirname, './routes/') + i})
});
// ... routes
app.get('/docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

module.exports = app;
