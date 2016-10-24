var passport = require('passport'),
    sql = require('mssql'),
    config = require('./config'),
    //FacebookStrategy = require('passport-facebook').Strategy,
    JwtStrategy = require('passport-jwt').Strategy;
    ExtractJwt = require('passport-jwt').ExtractJwt;
//User = require('../models/user');

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Configura JWT
    passport.use(new JwtStrategy({
            secretOrKey: config.jwt.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        },
        function(jwt_payload, done) {
            done(null, jwt_payload);

            // TODO: implementar control de token
            // sql.connect(config.sql, function(err) {
            //     if (err)
            //         return done(err, false);
            //
            //     new sql.Request()
            //         .input('id', sql.Int, jwt_payload.sub)
            //         .query(config.sqlQueries.checkUser, function(err, data) {
            //             if (err)
            //                 return done(err, false);
            //             done(null, data[0]);
            //         })
            // });
        }));

    // Configura Facebook
    // passport.use(new FacebookStrategy({
    //     clientID: config.facebook.clientID,
    //     clientSecret: config.facebook.clientSecret,
    //     callbackURL: config.facebook.callbackURL
    // }, function(token, refreshToken, profile, done) {
    //     // find the user in the database based on their facebook id
    //     User.findOne({
    //         'facebook.id': profile.id
    //     }, function(err, user) {
    //         // if there is an error, stop everything and return that
    //         // ie an error connecting to the database
    //         if (err)
    //             return done(err);
    //
    //         // if the user is found, then log them in
    //         if (user) {
    //             return done(null, user); // user found, return that user
    //         } else {
    //             // if there is no user found with that facebook id, create them
    //             var newUser = new User();
    //
    //             // set all of the facebook information in our user model
    //             newUser.facebook.id = profile.id; // set the users facebook id
    //             newUser.facebook.token = token; // we will save the token that facebook provides to the user
    //             newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
    //             newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
    //
    //             // save our user to the database
    //             newUser.save(function(err) {
    //                 if (err)
    //                     throw err;
    //
    //                 // if successful, return the new user
    //                 return done(null, newUser);
    //             });
    //         }
    //     });
    // }));
}
