require('rootpath')();

let usuarios_db = {};

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

usuarios_db.getAll = (funCallBack) => {
    $query = 'SELECT * FROM usuarios';

    connection.query($query, function (err, rows) {
        if (err) {
            funCallBack(err);
            return;
        }
        funCallBack(rows);
    });
};

usuarios_db.getByMail = (mail, funCallBack) => {
    let consulta = 'SELECT * FROM usuarios WHERE mail = ?';

    connection.query(consulta, [mail], (err, rows) => {
        if (err) {
            funCallBack(err);
            return;
        }
        funCallBack(rows);
    });
};

usuarios_db.create = (usuario_sent, funCallBack) => {

    $query = 'INSERT INTO usuarios (mail, nickname, clave, persona) VALUES (?, ?, ?, ?)';

    parametros = [usuario_sent.mail, usuario_sent.nickname, usuario_sent.clave, usuario_sent.persona];

    connection.query($query, parametros, (err, rows) => {
        if (err) {

            if (err.code == 'ER_DUP_ENTRY') {

                funCallBack({
                    message: 'El usuario ya fue registrado.',
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
                message: `Se creó el usuario: ${usuario_sent.mail} ${usuario_sent.nickname} ${usuario_sent.persona}`,
                detail: rows
            });
        }
    });

};

usuarios_db.update = (mail, usuario_data, funCallBack) => {

    $query = 'UPDATE usuarios set mail = ?, nickname = ?, clave = ? WHERE mail = ?';

    parametros = [usuario_data.mail, usuario_data.nickname, usuario_data.clave, mail];

    connection.query($query, parametros, (err, rows) => {
        if (err) {

            funCallBack({
                message: 'Error del servidor.',
                detail: err
            });
        } else {
            if (rows.affectedRows === 0) {
                funCallBack({
                    message: `No se encontró el usuario: ${usuario_data.mail}`,
                    detail: err
                });

            } else {

                funCallBack(undefined, {
                    message: `Se modificó el usuario: ${usuario_data.mail}`,
                    detail: rows
                });
            }
        }
    });

};

usuarios_db.delete = (mail, funCallBack) => {

    $query = 'DELETE FROM usuarios WHERE mail = ?';

    parametros = [mail];

    connection.query($query, parametros, (err, rows) => {
        if (err) {
            funCallBack({
                message: 'Error del servidor.',
                detail: err
            });
        } else {
            if (rows.affectedRows == 0) {
                funCallBack({
                    message: `No se encontró el usuario con el mail: ${mail}`,
                    detail: err
                });
            } else {
                funCallBack(undefined, {
                    message: `Se eliminó el usuario con el mail: ${mail}`,
                    detail: rows
                });
            }
        }
    });
};

module.exports = usuarios_db;