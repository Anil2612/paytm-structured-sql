var route = require('express').Router();
const mysqlConnection = require('../config/config-sql-connection');


//Login to user
route.post('/login', async (req, res) => {
    new Promise((resolve, reject) => {
        var loginuser = req.body;
        if (Number.isInteger(loginuser.mobilenumber) == false) {
            reject({ message: 'Wrong credentials', status: 'fail' });
        }
        var sql = `select count(*) count from users where  mobilenumber='${loginuser.mobilenumber}' 
    and password='${loginuser.password}'`;
        mysqlConnection.query(sql, (err, row) => {
            if (row[0].count == 1) {

                resolve({ message: 'Login successful', status: 'success' });
            }
            else {
                res.status(401);
                reject({ message: 'Login failed', status: 'fail' });
            }
        });
    })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = route;