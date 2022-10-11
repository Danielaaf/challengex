const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err){
        const error = new HttpError('Algo salió mal.', 500);
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Campos inválidos, revisa los datos.', 422));
    }

    const {name, username, password, userCreatorId, tipo} = req.body;

    //Solo un profesor puede crear alumnos
    if(tipo!=='profesor'){
        let userCreator;

        try{
            userCreator = await User.findById(userCreatorId);
        } catch (err){
            const error = new HttpError('Algo salió mal.', 500);
            return next(error);
        }

        if (userCreator["tipo"] !== 'profesor'){
            return next(new HttpError('No tienes permiso para hacer eso.', 403));
        }
    }
    
    //Verificar que el username sea unico
    let existingUser;
    
    try{
        existingUser = await User.findOne({username: username});
    } catch (err){
        const error = new HttpError('Algo salió mal.', 500);
        return next(error);
    }

    if (existingUser){
        const error = new HttpError('Ese Nombre de Usuario ya existe.', 422);
        return next(error);
    }

    //Crear usuario
    const createdUser = new User({
        name,
        username,
        password,
        tipo
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            {
                userId: createdUser.id,
                username: createdUser.username,
                tipo: createdUser.tipo
            },
            'supersecret_dont_share',
            {
                expiresIn: '1h'
            }
        )
    }catch(err){
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    res.status(201).json({
        userId: createdUser.id,
        username: createdUser.username,
        tipo: createdUser.tipo,
        token: token
    });

};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    let identifiedUser;
    
    try{
        identifiedUser = await User.findOne({username: username});
    } catch (err){
        const error = new HttpError('Algo salió mal.', 500);
        return next(error);
    }


    if(!identifiedUser || identifiedUser.password !== password){
        return next(new HttpError('No se pudo identificar al usuario, revisa las credenciales.', 401));
    }

    let token;
    try{
        token = jwt.sign(
            {
                userId: identifiedUser.id,
                username: identifiedUser.username,
                tipo: identifiedUser.tipo
            },
            'supersecret_dont_share',
            {
                expiresIn: '1h'
            }
        )
    }catch(err){
        const error = new HttpError('La operación falló', 500);
        return next(error);
    }

    res.json({
        userId: identifiedUser.id,
        username: identifiedUser.username,
        tipo: identifiedUser.tipo,
        token: token
    });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;