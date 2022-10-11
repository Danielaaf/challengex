require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const cursosRoutes = require('./routes/cursos-routes');
const usersRoutes = require('./routes/users-routes');
const evalRoutes = require('./routes/evaluaciones-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

/*var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:8081"
};
app.use(cors(corsOptions));*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*'),
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE')
  next();
});

app.use('/api/cursos',cursosRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/evaluaciones',evalRoutes);

app.use((req, res, next) => {
    const error = new HttpError('¿Como llegaste aquí?', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred.'});
});

const db = require("./models");

console.log(db.url);
    
db.mongoose
    .connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      directConnection: true
    })
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch(err => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
