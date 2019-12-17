var route = require('express').Router();
var mysqlConnection = require('../config/config-sql-connection');

route.post('/addmoney', async (req, res) => {
    new Promise((resolve, reject) => {
        var addmoney = req.body;
        if(Number.isInteger(addmoney.balance)==false || Number.isInteger(addmoney.mobilenumber)==false){
            reject({ message: 'Wrong credentials or amount',status:'fail' });
        }
        var sql = `
    update users
    set balance=balance+'${addmoney.balance}'
    where mobilenumber='${addmoney.mobilenumber}' 
    and password='${addmoney.password}'
    and '${addmoney.balance}'>0
     `;
        mysqlConnection.query(sql, (err, row) => {
            if (!err) {
                if ( row.affectedRows == 0) {
                    reject({ message: 'Wrong credentials or amount',status:'fail' });
                }
                else{
                resolve({ message: 'Money added to valet',status:'success' });
            }
            }
        });
    })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        })
});

module.exports = route;