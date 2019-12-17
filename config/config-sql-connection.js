const mysql = require('mysql');
const sqlConnection = require('./config');

var mysqlConnection = mysql.createConnection({
    host: `${sqlConnection.host}`,
    user: `${sqlConnection.user}`,
    password: `${sqlConnection.password}`,
    database: `${sqlConnection.database}`,
    multipleStatements: `${sqlConnection.multipleStatements}`
});


module.exports = mysqlConnection;