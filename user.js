var
    config = require('./config'),
    Ubicacion = require('./models/Ubicacion'),
    crypto = require('crypto'),
    async = require('async'),
    sql = require('mssql');

module.exports = {
    get: function(username, password, callback) {
        sql.connect(config.sql, function(err) {
            if (err)
                return callback(err);

            new sql.Request()
                .input('username', sql.VarChar(100), username)
                .input('password', sql.VarChar(100), crypto.createHash('md5').update(password).digest('hex'))
                .query(config.sqlQueries.getUser, function(err, data) {
                    if (err)
                        return callback(err);
                    if (!data || !data.length)
                        return callback(new Error("Not found"));

                    var variables = {};
                    var servicioActual = [];
                    data.forEach(function(i) {
                        var value = isNaN(i.value) ? i.value : Number(i.value);
                        if (i.multipleValues) {
                            if (!variables[i.variable])
                                variables[i.variable] = [];
                            variables[i.variable].push(value);
                        } else {
                            variables[i.variable] = value;
                        }
                    });

                    // Para compatibilidad con las aplicaciones legacy, parsea variables conocidas
                    async.series([
                        // 1. prestaciones_workflow
                        // function(asyncCallback) {
                        //     if (variables.prestaciones_workflow) {
                        //         var value;
                        //         switch (variables.prestaciones_workflow) {
                        //             case 1:
                        //                 value = 'medico';
                        //                 break;
                        //             case 2:
                        //                 value = 'administrativo';
                        //                 break;
                        //             case 3:
                        //                 value = 'tecnico';
                        //                 break;
                        //             case 4:
                        //                 value = 'enfermero';
                        //                 break;
                        //         }
                        //         variables.prestaciones_workflow = value;
                        //     }
                        //     asyncCallback();
                        // },
                        // 2. ubicacion
                        // function(asyncCallback) {
                        //     if (variables.ubicacion) {
                        //         Ubicacion.find({
                        //             'idExterno.ubicaciones': {
                        //                 $in: variables.ubicacion
                        //             }
                        //         }, function(err, docs) {
                        //             if (err)
                        //                 return asyncCallback(err);

                        //             variables.ubicacion = docs.map(function(i) {
                        //                 return {
                        //                     id: i._id.toString(),
                        //                     nombre: i.nombre,
                        //                     nombreCorto: i.nombreCorto,
                        //                     tipo: i.tipo,
                        //                 }
                        //             });
                        //             asyncCallback();
                        //         });
                        //     } else {
                        //         asyncCallback();
                        //     }
                        // },
                        // 3. servicio actual
                        // function(asyncCallback) {
                        //     if (variables.ubicacion) {
                        //         var ubicaciones = variables.ubicacion;
                        //         ubicaciones.forEach(function(ubicacion){
                        //             if (ubicacion.tipo == 'servicio'){
                        //                 variables.servicioActual = ubicacion;
                        //             }
                        //         });

                        //         asyncCallback();
                        //     } else {
                        //         asyncCallback();
                        //     }
                        // }
                    ], function(err) {
                        if (err)
                            return callback(err);
                        else
                            callback(null, {
                                id: data[0].id,
                                name: data[0].name,
                                given_name: data[0].given_name,
                                family_name: data[0].family_name,
                                avatar: (data[0].avatar) ? data[0].avatar : '',
                                variables: '' //variables
                            });
                    });
                })
        })
    },
    getSetting: function(user, setting, callback) {
        sql.connect(config.sql, function(err) {
            if (err)
                return callback(err);

            new sql.Request()
                .input('userId', sql.Int, user)
                .input('settingId', sql.VarChar(100), setting)
                .query(config.sqlQueries.getSetting, function(err, data) {
                    if (err)
                        return callback(err);

                    callback(null, (data && data.length) ? data[0].value : null);
                })
        });
    },
    setSetting: function(user, setting, value, callback) {
        sql.connect(config.sql, function(err) {
            if (err)
                return callback(err);

            new sql.Request()
                .input('userId', sql.Int, user)
                .input('settingId', sql.VarChar(100), setting)
                .input('value', sql.VarChar(100), value)
                .query(config.sqlQueries.setSetting, function(err, data) {
                    if (err)
                        return callback(err);

                    callback(null, value);
                })
        });
    }
};
