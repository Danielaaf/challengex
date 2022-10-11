const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlenght: 5},
    tipo: {type: String, required: true},
    cursos: [{type: mongoose.Types.ObjectId, required: true, ref: 'Curso'}],
    evaluaciones: [{type: mongoose.Types.ObjectId, required: true, ref: 'Evaluacion'}],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);