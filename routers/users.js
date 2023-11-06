const sql = require("mssql");
const express = require("express");
const app = express();
const cors = require("cors");
var router = require("express").Router();

//get All tasks API   GET--REQUEST
router.get("/", async (req, res) => {
  try {
    if (req.query.UserId) {
      const UserId = parseInt(req.query.UserId) || 0; // Default to page 0 if not provided
      const query = `select username , color from userlogin`;

      const result = await sql.query(query);
      res.json(result.recordset);
    } else {
      const result = await sql.query("select username , userId , color from userlogin");
      res.json(result.recordset);
    }
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

module.exports = router;
