const express = require('express');
const { check } = require('express-validator');

const evalControllers = require('../controllers/evaluacion-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//Middleware jwt
router.use(checkAuth);

router.get('/user/:aid', evalControllers.getEvalsbyUserId);

router.post(
    '/', 
    [
        check('name').not().isEmpty(),
        check('curso').isLength({min: 5}),
        check('alumno').not().isEmpty(),
        check('nota').not().isEmpty()
    ],
    evalControllers.createEvaluacion);


module.exports = router;
