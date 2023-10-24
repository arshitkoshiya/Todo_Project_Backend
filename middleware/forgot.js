const jwt = require('jsonwebtoken');
const sql = require('mssql')

let jwtSecretKey = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt');
const validator = require('validator');
const saltRounds = 10; // Number of salt rounds (recommended: 10)

const forgotuser = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.newpassword;
    if (username && password) {
        if (!validator.isEmail(username)) {
            console.log("email is not valid");
            return res.send({
                result: "Fail",
                message: 'Please enter valid email address'
            });
        } else {
            const check = await sql.query(`select * from userlogin where username ='${username}' `)
            if (check.recordset.length >= 1) {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.error(err);
                        return res.json({
                            "error": err
                        })
                    }
                    // 'hash' contains the hashed password
                    console.log('Hashed Password:', hash);
                    req.body.newpassword = hash
                    next()
                });
            } else {
                res.json({
                    result: "Fail",
                    message: "User with these credentials is Not Exist"
                })

            }

        }
    }
}

module.exports = forgotuser