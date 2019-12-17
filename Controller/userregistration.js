const route = require('express').Router();
const mysqlConnection = require('../config/config-sql-connection');



route.post('/register', async (req, res) => {
    return new Promise((resolve, reject) => {
        var user = req.body;
        var mno = JSON.stringify((user.mobilenumber)).length;
        var password=user.password;
        var pswd=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(!password.match(pswd)){
            return reject({ message: 'Password must have a number,a special character and min 7 characters', status: 'fail' }); 
        }
        if (!isNaN(user.mobilenumber) && (user.mobilenumber) > 0 ) {
            if (mno == 10) {
                if ((user.password).length > 0) {
                    var sql = `insert into users(mobilenumber,password,email,balance) values('${user.mobilenumber}','${user.password}',
    '${user.email}',0);`
                    mysqlConnection.query(sql, (err, rows) => {
                        if (!err) {
                            return resolve({ message: 'Thank you for registering to paytm', status: 'success' });
                        }
                        else {
                            return reject({ message: 'Registration Failed due to duplicate entry', status: 'fail' });
                        }
                    });
                } else {
                    return reject({ message: 'Invalid password', status: 'fail' });
                }
            }
            else {
                return reject({
                    'message :': 'Mobile number should be 10 digit or invalid number'
                    , 'status': 'fail'
                });
            }
        } else {
            return reject({ message: 'Not a valid number', status: 'fail' });
        }
    })
        .then(resultData => {
            res.send(resultData);
        })
        .catch(err => {
            res.send(err);
        })
});

module.exports = route;
