var
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    user = require('../user'),
    config = require('../config');

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Devuelve el payload del token JWT si está autenticado
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 */
router.get('/me', passport.authenticate('jwt', {
        session: false
    }),
    function(req, res) {
        res.json(req.user);
    }
);

/**
 * @swagger
 * /login':
 *   post:
 *     summary: Genera un JWT de autenticación
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Nombre de usuario
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: Nombre de usuario
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 */
router.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password)
        return next(401);

    user.get(req.body.username, req.body.password, function(err, data) {
        
        if (err)
            return next(err);

        var token = jwt.sign({
            sub: data.id,
            id: data.id,
            name: data.name,
            avatar: (data.avatar) ? data.avatar : '',
            given_name: data.given_name,
            family_name: data.family_name,
            scope: {
                variables: data.variables,
            }
        }, config.jwt.secret, {
            expiresIn: 3000000
        });
        res.json({
            token: token
        });
    });
});

/**
 * @swagger
 * /settings/{name}:
 *   get:
 *     summary: Devuelve el setting almacenado para el usuario autenticado
 *     parameters:
 *       - name: name
 *         description: Nombre del setting
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 */
router.get('/settings/:name', passport.authenticate('jwt', {
        session: false
    }),
    function(req, res, next) {
        user.getSetting(req.user.sub, req.params.name, function(err, value) {
            if (err)
                return next(err);

            res.json({
                value: value
            });
        })
    }
);

/**
 * @swagger
 * /settings/{name}:
 *   post:
 *     summary: Almacena un nuevo valor para el setting del el usuario autenticado
 *     parameters:
 *       - name: name
 *         description: Nombre del setting
 *         in: path
 *         required: true
 *         type: string
 *       - name: value
 *         description: Valor del setting
 *         in: body
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 */
router.post('/settings/:name', passport.authenticate('jwt', {
        session: false
    }),
    function(req, res, next) {
        user.setSetting(req.user.sub, req.params.name, req.body.value, function(err, value) {
            if (err)
                return next(err);

            res.json({
                value: value
            });
        })
    }
);

module.exports = router;
