require('rootpath')();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuarios_db = require('/Cursos/scrap_00/TP07/practica_backend_00/model/usuarios_DB.js');

app.get('/', (req, res) => {
    usuarios_db.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.get('/:mail', (req, res) => {
    const mail = req.params.mail;

    usuarios_db.getByMail(mail, (resultados) => {
        res.json(resultados);
    });
});

app.post('/', (req, res) => {

    let create_usuario = req.body;

    usuarios_db.create(create_usuario, (err, result) => {

        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }

    });

});

app.put('/:mail', (req, res) => {
    let mail = req.params.mail;
    let usuario = req.body;

    usuarios_db.update(mail, usuario, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/:mail', (req, res) => {
    let usuario_delete = [req.params.mail];

    usuarios_db.delete(usuario_delete, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

module.exports = app;