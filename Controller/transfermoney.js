var route = require('express').Router();
var mysqlConnection = require('../config/config-sql-connection');
var response;


//Money Transfer

route.post('/transfer', async (req, res) => {
    response = res;
    var transferdetails = req.body;
    if(Number.isInteger(transferdetails.money)==false && Number.isInteger(transferdetails.touser)==false && Number.isInteger(transferdetails.fromusers)==false){
        res.send({ message: 'Wrong credentials or amount',status:'fail' });
    }
try {
    let sql = await updatefromuser(transferdetails);
    var sqlt = await updatetouser(transferdetails);
    var sqlth = await transactionhistory(transferdetails);
    res.send(sqlth);
} catch (error) {
    res.send(error);
}
    

});

let updatefromuser = (transferdetails) => {
    return new Promise((resolve, reject) => {
        
        var sql = `
        update users 
        set balance=balance-'${transferdetails.money}'
        where 
        balance>='${transferdetails.money}' 
        and '${transferdetails.money}'>0
        and mobilenumber='${transferdetails.fromuser}' 
        and password ='${transferdetails.password}'
        `;
        mysqlConnection.query(sql, async (err, row) => {
            if (row.affectedRows != 0) {
                if (!err) {
                    return resolve({status : 'in process'})
                }
                else {
                }
            }
            else {
               return reject({ message: 'Processing failed-Wrong username,password or Invalid balance', status: 'fail' });
            }
        });
    });
}

let updatetouser = (transferdetails) => {
    return new Promise((resolve, reject) => {
        var sqlt = `
        update users
        set balance=balance+'${transferdetails.money}'
        where mobilenumber='${transferdetails.touser}'
        `;
        mysqlConnection.query(sqlt, async (err, rows) => {
            if (!err && rows.affectedRows!=0) {
                resolve({status : 'pass'})
            }
            else {
               return reject({ message: 'Transaction Failed', status: 'fail' });
            }
        });

    });
}

let transactionhistory = (transferdetails) => {
    let date=new Date().toLocaleString();
    return new Promise((resolve, reject) => {
        var sqlth = `insert into transactionhistory values
        ('${transferdetails.fromuser}','${transferdetails.touser}','${date}','credited','${transferdetails.money}')`;
        mysqlConnection.query(sqlth, (err, rows) => {
            if (!err) {
               return resolve({ message: 'Transaction successful and Saved', status: 'success' })
            }
            else {
              return  reject({ message: 'Transaction successful and Saving failed', status: 'fail' });
                
            }
        })
    })
        // .then(result => {
   
}


module.exports = route;