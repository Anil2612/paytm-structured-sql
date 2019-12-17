const route = require('express').Router();
const mysqlConnection = require('../config/config-sql-connection');
var sqlresult;



//Show all transaction details to admin
route.get('/showtransactions', async (req, res) => {
    new Promise((resolve, reject) => {
        var tcredential = req.body;
        
        var sql = `select * from transactionhistory where exists
    (select * from admin 
    where mobilenumber='${tcredential.mobilenumber}' and password='${tcredential.password}')`;
        mysqlConnection.query(sql, (err, row) => {
            sqlresult = row;
            if (!err) {
                resolve({ message: 'Not an Admin', status: 'success' });
            }
            else {
                reject({ message: 'Transaction history loading failed', status: 'fail' });
            }
        });
    })
        .then(result => {
            if (sqlresult == '') {
                res.send(result);
            }
            else {
                res.send(sqlresult);
            }

        })
        .catch(err => {
            res.send(err);
        })
});
module.exports = route;
