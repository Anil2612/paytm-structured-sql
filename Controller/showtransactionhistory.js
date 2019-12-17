const route = require('express').Router();
const mysqlConnection = require('../config/config-sql-connection');
var sqlresult;


//Show transaction history
route.get('/transactionhistory', async (req, res) => {
    new Promise((resolve, reject) => {
        var t_history = req.body;
        if(Number.isInteger(t_history.mobilenumber)==false){
            reject({ message: 'Wrong credentials or amount',status:'fail' });
        }
        var sql = `
    select touser,transactiontimedate,activity,transferamount from transactionhistory 
    where fromuser=${t_history.mobilenumber} 
    `;
        mysqlConnection.query(sql, (err, row) => {
            if (!err) {
                sqlresult = row;
                resolve({ message: 'No Transaction History', status: 'success' });
            }
            else {
                reject({ message: 'Your Transaction history failed loading', status: 'fail' })
            }
        });
    })
        .then(result => {
            if (sqlresult == '') {
                res.send(result);
            }
            else
                res.send(sqlresult);
        })
        .catch(err => {
            res.send(err);
        })
});
module.exports = route;
