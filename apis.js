const sql = require('mssql')
var router = require("express").Router();
const express = require('express');





//get All Country
router.get("/country/PageSize=:Pagesize?", async (req, res) => {
    try {
        if(req.params.Pagesize){
            let pageSize=parseInt(req.params.Pagesize)
            const result = await sql.query(`select top ${pageSize} * from country`)
            res.json(result.recordset)
        }else{

            const result = await sql.query("SELECT * FROM Country");
            res.json(result.recordset);
        }
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.status(500).json({ error: "Internal Server error" });
    }
});


//Add/Update Country
router.post("/Country", async (req, res) => {
    try {
        console.log(req.body.CountryName)
        const CountryName = req.body.CountryName
        const check = await sql.query(`select * from country where CountryName ='${CountryName}' `)
        console.log("Length : " + check.recordset.length)
        if (check.recordset.length >= 1) {
            res.send({
                "result": "Country Name Already Exists"
            })
        } else {
            if(req.body.PKId){
                const PKId = req.body.PKId
                await sql.query(`update Country set CountryName = '${CountryName}' , ModifiedOn = getdate() where PKId = ${PKId}`);
                res.json({
                    "result": "Success"
                }).status(202);
            }else{
                await sql.query(`Insert into country values('${CountryName}',1,0,getdate(), 1, getdate())`);
                res.json({
                    "result": "Success"
                }).status(202);
            }
        }
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.status(500).json({ "result": "Fail" });
    }
});


// DELETE Country
router.delete("/Country", async (req, res) => {
    try {
        const PKId = req.body.PKId
        const check = await sql.query(`select * from country where PKId ='${PKId}' `)
        if (check.recordset.length >= 1) {
            await sql.query(`delete from Country where PKId = ${PKId}`);
            res.send({
                "result": "Success"
            })
        } else {
            res.json({
                "result": "PKId Not Found"
            }).status(202);
        }
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.status(500).json({ "result": "Fail" });
    }
});




module.exports = router;
