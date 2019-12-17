const express = require('express');
const route = express.Router();
const mysqlConnection = require('../config/config-sql-connection');

//Displaying the users
var sqlresult;
route.get('/users', (req, res) => {
    new Promise((resolve, reject) => {


        var sql = `select * from users`;
        mysqlConnection.query(sql, (err, row) => {
            if (!err) {
                resolve({ message: 'Users Displayed',status:'success' });
                sqlresult=row;
            }
            else {
                reject({ message: 'Users not displayed',status:'fail' });
            }
        });
    })
        .then(result => {
            res.send(sqlresult);
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = route;