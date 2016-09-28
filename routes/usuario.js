"use strict";
var express = require('express');
var usuario = require('../models/usuario');
var router = express.Router();

router.get('/usuario', function(req, res, next) {
            usuario.find(function(err, data) {
                if (err) {
                    next(err);
                };
                res.json(data);
            });
        });


router.post('/usuario', function(req, res, next) {
            var newUsuario = new usuario(req.body);
            newUsuario.save(function(err) {
                if (err) {
                    next(err);
                }
                res.json(newUsuario);
            });
        });


module.exports = router;
