const sql = require('mssql')
var router = require("express").Router();
var signupuser = require('../middleware/signup')


router.post('/', signupuser, async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const result = await sql.query(`INSERT INTO userlogin values ('${username}' , '${password}' , getdate())`)
        console.log(result)
        res.json({
            result: "success",
            message: "Account creation complete. You're good to go!"
        })
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.json({
            result: "Fail",
            message: "Error executing SQL query"
        });
    }
})
router.post('/userdata', signupuser, async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const result = await sql.query(`select username from userlogin`)
        console.log(result)
        res.json({
            result: "success",
            message: "Account creation complete. You're good to go!"
        })
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.json({
            result: "Fail",
            message: "Error executing SQL query"
        });
    }
})

module.exports = router;