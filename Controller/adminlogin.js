const route=require('express').Router();
const mysqlConnection=require('../config/config-sql-connection');

//Admin login
route.post('/adminlogin',async (req, res) => {
    new Promise((resolve,reject)=>{
    var loginadmin = req.body;
    if(Number.isInteger(loginadmin.mobilenumber)==false){
        reject({message:'Admin login failed',status:'fail'});
    }
    var sql = `select count(*) count from admin where  mobilenumber='${loginadmin.mobilenumber}' 
    and password='${loginadmin.password}'`;
    mysqlConnection.query(sql, (err, row) => {
        if (row[0].count == 1 ) {
            resolve({message:'Admin login successful',status:'success'});
        }
        else {
            res.status(401);
            reject({message:'Admin login failed',status:'fail'});
        }
    });
})
.then(result=>{
    res.send(result);
})
.catch(err=>{
    res.send(err);
});
});

module.exports=route;
