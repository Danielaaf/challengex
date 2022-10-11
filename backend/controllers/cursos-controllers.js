const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Curso = require('../models/curso');
const User = require('../models/user');


const getCursobyId = async (req, res, next) => {
    const cursoId = req.params.cid;
    let curso;
    
    try {
        curso = await Curso.findById(cursoId);

    } catch {
        const error = new HttpError('Algo salió mal.', 500);
        return next(error);
    }
    
    if(!curso){
        const error = new HttpError('No se encontró el curso.', 404);
        return next(error);
    }

    res.json({curso: curso.toObject({getters: true})});
};

const getCursosbyProfesorId = async (req, res, next) => {
    const userId = req.params.uid;
    let cursos;

    try {
        cursos = await Curso.find({ profesor: userId });
    }catch (err){
        const error = new HttpError('No se logró encontrar los cursos.', 500);
        return next(error);
    }

    if(!cursos || cursos.length === 0){
        return next(new HttpError('No se encontraron cursos para este usuario.', 404));
    }

    res.json({cursos: cursos.map(curso => curso.toObject({getters:true}))});
};

const getCursosbyUserId = async (req, res, next) => {
    const userId = req.params.aid;
    let userWithcursos;

    try {
        userWithcursos = await User.findById(userId).populate('cursos');
    }catch (err){
        const error = new HttpError('No se logró encontrar los cursos.', 500);
        return next(error);
    }

    if(!userWithcursos || userWithcursos.cursos.length === 0){
        return next(new HttpError('No se encontraron cursos para este usuario.', 404));
    }

    res.json({cursos: userWithcursos.cursos.map(curso => curso.toObject({getters:true}))});
};

const createCurso = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Campos inválidos, revisa los datos.', 422));
    }

    const {title, description, profesor} = req.body;
    

    const createdCurso = new Curso({
        title,
        description,
        profesor
    });

    let user;
    try{
        user = await User.findById(profesor);
    }catch(err){
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }
    console.log('hola');

    if(!user){
        const error = new HttpError('No se pudo encontrar el profesor.', 404);
        return next(error);
    }

    try {
        await createdCurso.save();
        console.log(createdCurso);
        user.cursos.push(createdCurso);
        await user.save();

    } catch(err) {
        console.log(err);
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    res.status(201).json({curso: createdCurso});
};

const updateCursobyId = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Campos inválidos, revisa los datos.', 422));
    }

    const {alumnos} = req.body; //Arreglo de id de los alumnos
    const cursoId = req.params.cid;

    let curso;
    try{
        curso = await Curso.findById(cursoId); 
    } catch (err) {
        const error = new HttpError('No se pudo actualizar.', 500);
        return next(error);
    }
    console.log(alumnos);

    console.log(curso.alumnos);

    //curso.alumnos = alumnos;

    //Revisar que los alumnos existan y no esten en el curso
    let user;
    try{
        for (al of alumnos){
            user = await User.findById(al);
            if(!user){
                const error = new HttpError('No se pudo encontrar al alumno.', 404);
                return next(error);
            }
            if(!curso.alumnos.includes(al)){
                curso.alumnos.push(al);
            }
            if(!user.cursos.includes(curso)){
                user.cursos.push(curso);
                await user.save()
            }
        }
    } catch (err) {
        const error = new HttpError('Algo salió mal.', 500);
        return next(error);
    }

    try{
        await curso.save();
    } catch (err){
        const error = new HttpError('No se pudo actualizar el curso.', 500);
        return next(error);
    }

    res.status(200).json({curso: curso.toObject({getters:true})});

};

exports.getCursobyId = getCursobyId;
exports.getCursosbyProfesorId = getCursosbyProfesorId;
exports.createCurso = createCurso;
exports.updateCursobyId = updateCursobyId;

exports.getCursosbyUserId = getCursosbyUserId;