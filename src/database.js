const mysql = require ('mysql');
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('LA BASE DE DATOS SE DESCONECTÓ')
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('LA BASE DE DATOS TIENE MUCHAS CONEXIONES')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('LA CONEXION FUE RECHAZADA')
        }
    }
    if(connection) connection.release();
    console.log('BD CONECTADA');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;
