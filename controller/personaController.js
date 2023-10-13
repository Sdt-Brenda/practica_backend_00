require('rootpath')();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let personas_db = require('/Cursos/scrap_00/TP07/practica_backend_00/model/personas_DB.js');

app.get('/', (req, res) => {
    personas_db.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.get('/:apellido', (req, res) => {
    const apellido = req.params.apellido;

    personas_db.getByApellido(apellido, (resultados) => {
        res.json(resultados);
    });
});

app.get('/dni/:dni',(req, res) => {

    personas_db.getUser(req.params.dni, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    })
});

app.post('/', (req, res) => {

    let create_person = req.body;

    personas_db.create(create_person, (err, result) => {

        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }

    });

});

app.put('/:dni', (req, res) => {
    let dni = req.params.dni;
    let persona = req.body;

    personas_db.update(dni, persona, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/:dni', (req, res) => {
    let persona_delete = [req.params.dni];

    personas_db.delete(persona_delete, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

module.exports = app;