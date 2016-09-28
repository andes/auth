"use strict";
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var usuarioSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Se ejecuta antes de cada usuario.save() call
usuarioSchema.pre('save', function(callback) {
    var usr = this;

    // Salir si la contraseña ha sido cambiada
    if (!usr.isModified('password')) return callback();

    // El password ha sido modificado
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(usr.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            usr.password = hash;
            callback();
        });
    });
});

usuarioSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var usuario = mongoose.model('usuario', usuarioSchema, 'usuario');
module.exports = usuario;
