const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.cursos = require('./curso.js')(mongoose);
db.users = require('./user.js')(mongoose);
db.evaluaciones = require('./evaluacion.js')(mongoose);

module.exports = db;