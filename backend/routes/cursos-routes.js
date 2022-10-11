const express = require('express');
const { check } = require('express-validator');

const cursosControllers = require('../controllers/cursos-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//Middleware jwt
router.use(checkAuth);

router.get('/:cid', cursosControllers.getCursobyId);

router.get('/profesor/:uid', cursosControllers.getCursosbyProfesorId);

router.get('/user/:aid', cursosControllers.getCursosbyUserId);

router.post(
    '/', 
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('profesor').not().isEmpty()
    ],
    cursosControllers.createCurso);

router.patch(
    '/:cid',
    [
        check("alumnos").not().isEmpty()
    ],
    cursosControllers.updateCursobyId);

module.exports = router;
