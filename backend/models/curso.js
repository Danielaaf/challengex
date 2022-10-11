const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    profesor: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    alumnos: [{type: mongoose.Types.ObjectId, required: true, ref: 'User'}],
    evaluaciones: [{type: mongoose.Types.ObjectId, required: true, ref: 'Evaluacion'}],
});

module.exports = mongoose.model("Curso", cursoSchema);