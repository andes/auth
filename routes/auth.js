var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var usuario = require('../models/usuario');

passport.use(new BasicStrategy(
  function(userName, password, callback) {
    usuario.findOne({ userName: userName }, function (err, user) {
      if (err) { return callback(err); }

      // No existe usuario con ese nombre
      if (!user) { return callback(null, false); }

      // se verifica que el password sea correcto
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // el password no es correcto
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

exports.autenticado = passport.authenticate('basic', { session : false });
