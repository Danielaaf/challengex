const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const evaluacionSchema = new Schema({
    name: {type: String, required: true},
    curso: {type: mongoose.Types.ObjectId, required: true, ref: 'Curso'},
    alumno: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    nota: {type: Number, required: false, min: 1}
});

module.exports = mongoose.model("Evaluacion", evaluacionSchema);