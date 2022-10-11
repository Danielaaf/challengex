const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Curso = require('../models/curso');
const User = require('../models/user');
const Evaluacion = require('../models/evaluacion');

const createEvaluacion = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Campos inválidos, revisa los datos.', 422));
    }

    const {name, curso, alumno, nota} = req.body;
    const createdEvaluacion = new Evaluacion({
        name,
        curso,
        alumno,
        nota
    });
    
    //Obtener y verificar que el curso existe.
    let existingCurso;
    try{
        existingCurso = await Curso.findById(curso);
    }catch(err){
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    if(!existingCurso){
        const error = new HttpError('No se pudo encontrar el curso.', 404);
        return next(error);
    }

    //Obtener y verificar que el alumno existe.
    let existingAlumno;
    try{
        existingAlumno = await User.findById(alumno);
    }catch(err){
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    if(!existingAlumno){
        const error = new HttpError('No se pudo encontrar el alumno.', 404);
        return next(error);
    }
    
    try {
        await createdEvaluacion.save();
        console.log(createdEvaluacion);
        existingAlumno.evaluaciones.push(createdEvaluacion);
        existingCurso.evaluaciones.push(createdEvaluacion);
        await existingAlumno.save();
        await existingCurso.save();

    } catch(err) {
        console.log(err);
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    res.status(201).json({evaluacion: createdEvaluacion});
};

const getEvalsbyUserId = async (req, res, next) => {
    const userId = req.params.aid;
    let userWithevaluaciones;

    try {
        userWithevaluaciones = await User.findById(userId).populate('evaluaciones');
    }catch (err){
        const error = new HttpError('No se logró encontrar las evaluaciones.', 500);
        return next(error);
    }

    if(!userWithevaluaciones || userWithevaluaciones.evaluaciones.length === 0){
        return next(new HttpError('No se encontraron evaluaciones para este usuario.', 404));
    }

    res.json({evaluaciones: userWithevaluaciones.evaluaciones.map(evaluacion => evaluacion.toObject({getters:true}))});
};

exports.createEvaluacion = createEvaluacion;
exports.getEvalsbyUserId = getEvalsbyUserId;