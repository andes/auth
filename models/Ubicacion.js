var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    nombre: String,
    nombreCorto: String,
    tipo: String,
});

module.exports = mongoose.model('Ubicacion', schema, 'ubicaciones')
