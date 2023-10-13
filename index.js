require('rootpath')();

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res [content-lenght] - :response-time ms');

const configuration = require('./config.json');
const controlador_persona = require('./controller/personaController.js');
const controlador_usuario = require('./controller/usuariosController.js');

app.use('/api/personas', controlador_persona);
app.use('/api/usuarios', controlador_usuario);

app.listen(configuration.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`server ON, port: ${configuration.server.port}`);
    }
});