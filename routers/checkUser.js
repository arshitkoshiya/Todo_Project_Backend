const sql = require('mssql')
var router = require("express").Router();


//Add/Update Country API    POST--REQUEST
router.post("/", async (req, res) => {
    try {
        const username = req.body.username
        const check = await sql.query(`select * from  userlogin where username = '${username}'`)
        if (check.recordset.length >= 1) {

            res.send({
                result: true,
                message: "User Exists"
            })
        }else{
            res.send({
                result: false,
                message: "User Not found"
            })
        }
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.json({ "result": "Fail" });
    }
});
module.exports = router;