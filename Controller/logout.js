const express = require('express');
var mysqlConnection = require('../config/config-sql-connection');
const route = express.Router();
route.post('/logout', (req, res) => {
    var user = req.body;
    var sql = `select mobilenumber from users where mobilenumber='${user.mobilenumber}' and password='${user.password}'`;
    mysqlConnection.query(sql, (err, result) => {
        if (result == '') {
            res.send({ message: "Logout failed", status: "fail" });
        }
        else {
             res.send({ message: "Logout", status: "success" });
        }
    });
});

module.exports = route;