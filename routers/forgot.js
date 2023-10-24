const sql = require('mssql')
var router = require("express").Router();
var loginuser = require('../middleware/login')
var validationData = require('../middleware/countryMiddleware')
const { body, validationResult } = require('express-validator');
var forgotuser = require('../middleware/forgot')


//Add/Update Country API    POST--REQUEST
router.put("/", forgotuser, async (req, res) => {
    try {
        console.log(req.body.newpassword)
        const username = req.body.username
        const newPassword = req.body.newpassword

        const check = await sql.query(`update userlogin set password = '${newPassword}' where username = '${username}'`)
        res.send({
            result : 'success',
            message : "password updated successfully"
        })
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.json({ "result": "Fail" });
    }
});
module.exports = router;