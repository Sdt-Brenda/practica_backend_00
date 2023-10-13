require('rootpath')();

let personas_db = {};

const mysql = require('mysql');
const configuration = require('../config.json');

let connection = mysql.createConnection(configuration.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('DB connected');
    }
});

personas_db.getAll = (funCallBack) => {
    $query = 'SELECT * FROM personas';

    connection.query($query, function (err, rows) {
        if (err) {
            funCallBack(err);
            return;
        }
        funCallBack(rows);
    });
};

personas_db.getByApellido = (apellido, funCallBack) => {
    let consulta = 'SELECT * FROM personas WHERE apellido = ?';

    connection.query(consulta, [apellido], (err, rows) => {
        if (err) {
            funCallBack(err);
            return;
        }
        funCallBack(rows);
    });
};

personas_db.getUser = (dni, funCallBack) => {
    let consulta = 'SELECT nickname FROM usuarios WHERE usuarios.persona = ?';

    connection.query(consulta, dni, (err, res) => {
        if (err) {
            funCallBack({
                message: 'ERROR',
                detail: err
            })
        } else if (res.length == 0) {
            funCallBack(undefined, {
                message: 'La persona no tiene un usuario registrado en la DB.',
                detail: res
            });
        } else if (res.affectedRows == 0) {
            funCallBack(undefined, {
                message: 'No se halló la persona solicitada.',
                detail: res
            });
        } else {
            funCallBack(undefined, {
                message: `El nickname de la persona solicitada es: ${res[0]['nickname']}`,
                detail: res
            });
        }
    });
};

personas_db.create = (person_sent, funCallBack) => {

    $query = 'INSERT INTO personas (dni, nombre, apellido) VALUES (?, ?, ?)';

    parametros = [person_sent.dni, person_sent.nombre, person_sent.apellido];

    connection.query($query, parametros, (err, rows) => {
        if (err) {

            if (err.code == 'ER_DUP_ENTRY') {

                funCallBack({
                    message: 'La persona ya fue registrada.',
                    detail: err
                });
            } else {

                funCallBack({
                    message: 'Error del servidor.',
                    detail: err
                });
            }
        } else {

            funCallBack(undefined, {
                message: `Se creó la persona: ${person_sent.nombre} ${person_sent.apellido}`,
                detail: rows
            });
        }
    });

};

personas_db.update = (dni, person_data, funCallBack) => {

    $query = 'UPDATE personas set dni = ?, nombre = ?, apellido = ? WHERE dni = ?';

    parametros = [person_data.dni, person_data.nombre, person_data.apellido, dni];

    connection.query($query, parametros, (err, rows) => {
        if (err) {

            funCallBack({
                message: 'Error del servidor.',
                detail: err
            });
        } else {
            if (rows.affectedRows === 0) {
                funCallBack({
                    message: `No se encontró la persona: ${person_data.dni}`,
                    detail: err
                });

            } else {

                funCallBack(undefined, {
                    message: `Se modificó la persona: ${person_data.dni}`,
                    detail: rows
                });
            }
        }
    });

};

personas_db.delete = (dni, funCallBack) => {

    $query = 'DELETE FROM personas WHERE dni = ?';

    parametros = [dni];

    connection.query($query, parametros, (err, rows) => {
        if (err) {
            funCallBack({
                message: 'Error del servidor.',
                detail: err
            });
        } else {
            if (rows.affectedRows == 0) {
                funCallBack({
                    message: `No se encontró la persona con el DNI: ${dni}`,
                    detail: err
                });
            } else {
                funCallBack(undefined, {
                    message: `Se eliminó la persona con el DNI: ${dni}`,
                    detail: rows
                });
            }
        }
    });
};

module.exports = personas_db;