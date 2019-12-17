const mysql = require('mysql');
var url = require('url');
var fs = require('fs');
var uflag = 0;
var aflag = 0;
var user = 0;
var i = 0;
var jsonObj = [];
// var writerStream = fs.createWriteStream('./user.json');

// console.log(writerStream);
module.exports = (req, res, next) => {
    let loginuser = req.body;
    let currenturl = url.parse(req.url, true);
    let mysqlConnection = mysql.createConnection({
        host: `localhost`,
        user: `anil`,
        password: `password`,
        database: `paytm`,
        multipleStatements: `true`
    });

    mysqlConnection.connect((err) => {
        if (!err) {
            //Checking user or admin 
            var url = JSON.stringify(currenturl)
            if (url.includes('admin')) {
                user = 1;
            }
            else {
                user = 0;
            }
            switch (user) {
                case 0:
                    let data;
                    var uactivesql = `update users 
                    set active=true 
                    where mobilenumber='${loginuser.mobilenumber}' and password='${loginuser.password}'`;

                    var uinactivesql = `update users 
                    set active=false 
                    where mobilenumber='${loginuser.mobilenumber}' and password='${loginuser.password}'`;
                    if (url.includes('transfer')) {
                        var active = `select active from users where mobilenumber='${loginuser.fromuser}' and password='${loginuser.password}'`;
                    }
                    else {
                        var active = `select active from users where mobilenumber='${loginuser.mobilenumber}' and password='${loginuser.password}'`;
                    }

                    //For login user
                    if (url.includes('login')) {
                        function createJSON() {
                            var sessionID = (Math.random() * 100000);
                            sid = sessionID;
                            var mob = loginuser.mobilenumber;
                            var login = new Date().toLocaleString();
                            var logout = '';
                            item = {}
                            item["sessionid"] = sessionID;
                            item["mobilenumber"] = mob;
                            item["login"] = login;
                            item["logout"] = logout;
                            jsonObj[i++] = item;
                        }

                        let luser = req.body.mobilenumber;
                        let lpassword = req.body.password;
                        let date = new Date().toLocaleString();
                        var r;

                        var sql = `select active from users where mobilenumber='${luser}' and password='${lpassword}'`;
                        mysqlConnection.query(sql, (err, result) => {
                            if (result == '') {
                                console.log({ message: 'Invalid credentials', status: 'fail' });
                            }
                            else {
                                r = result[0].active;
                                if (r == 0) {
                                    createJSON();
                                    data = jsonObj;
                                    // writerStream.write(JSON.stringify(data) + '\n', 'UTF8');
                                    fs.writeFileSync('user.json',JSON.stringify(data));
                                }
                                else {
                                    console.log("Already Loginned");
                                }
                            }
                        });
                        mysqlConnection.query(uactivesql);
                        if (res.statusCode == 401) {
                            mysqlConnection.query(uinactivesql);
                        }
                    }
                    //For logout user
                    if (url.includes('logout')) {

                        let luser = req.body.mobilenumber;
                        let lpassword = req.body.password;
                        var r;

                        var sql = `select active from users where mobilenumber='${luser}' and password='${lpassword}'`;
                        mysqlConnection.query(sql, (err, result) => {
                            if (result == '') {
                                console.log({ message: 'Invalid credentials', status: 'fail' });
                            }
                            else {
                                r = result[0].active;
                                if (r == 1) {
                                    for (i = 0; i < jsonObj.length; i++) {
                                        if (luser == jsonObj[i].mobilenumber) {
                                            jsonObj[i].logout = new Date().toLocaleString();
                                        }
                                    }
                                    data = jsonObj;
                                    // writerStream.write(JSON.stringify(data), 'UTF8');
                                    fs.writeFileSync('user.json',JSON.stringify(data));
                                }
                                else {
                                    console.log("Already Logout");
                                }
                            }
                        });
                        mysqlConnection.query(uinactivesql);
                    }
                    mysqlConnection.query(active, (err, result) => {
                        if (result[0] == null) {
                            next();
                        }
                        else {
                            uflag = result[0].active;
                            if (uflag != 1 && !url.includes('register')) {
                                res.send({ message: "Please Login", status: "Out of session" });
                            }
                            else {
                                next();
                            }
                        }
                    });
                    

                    break;

                case 1:
                    var aactivesql = `update admin 
                    set active=true 
                    where mobilenumber='${loginuser.mobilenumber}' and password='${loginuser.password}'`;

                    var ainactivesql = `update admin 
                    set active=false 
                    where mobilenumber='${loginuser.mobilenumber}' and password='${loginuser.password}'`;

                    var aactive = `select active from admin where mobilenumber='${loginuser.mobilenumber}' and password='${loginuser.password}'`;

                    if (url.includes('logout')) {
                        mysqlConnection.query(ainactivesql);
                    }
                    if (url.includes('adminlogin')) {
                        mysqlConnection.query(aactivesql);
                        if (res.statusCode == 401)
                            mysqlConnection.query(ainactivesql);
                    }
                    mysqlConnection.query(aactive, (err, result) => {
                        if (result[0] == null) {
                            next()
                        } else {
                            aflag = result[0].active;
                            if (aflag != 1) {
                                res.send({ message: "Admin,Please Login", status: "Out of session" });
                            }
                            else {
                                next();
                            }
                        }
                    });
                    break;
                default: next();
                    break;
            }
        }
        else {
            res.send({ message: "Connection failed", status: "fail" });
        }
    });
}