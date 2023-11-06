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
      const query = `
      SELECT t.TaskId, t.TaskTitle, t.TaskDescription, t.Priority, t.LastDate, t.UserId, t.CreatedDate, t.AssignedTo, t.Status, u.username , u.color
      FROM userTasks AS t
      JOIN userLogin AS u ON t.AssignedTo = u.UserId
      WHERE t.UserId = ${UserId}
      `;

      const result = await sql.query(query);
      res.json(result.recordset);
    } else {
      const result = await sql.query(
        "SELECT t.TaskId, t.TaskTitle, t.TaskDescription, t.Priority, t.LastDate, t.UserId, t.CreatedDate, t.AssignedTo, t.Status, u.username ,u.color FROM userTasks AS t JOIN userLogin AS u ON t.AssignedTo = u.UserId"
      );
      res.json(result.recordset);
    }
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// DELETE Country API   DELETE--REQUEST
router.delete("/deleteTask", async (req, res) => {
  try {
      const Id = req.body.Id
      const check = await sql.query(`select * from userTasks where TaskId ='${Id}' `)
      if (check.recordset.length >= 1) {
          await sql.query(`delete from userTasks where TaskId = ${Id}`);
          res.send({
              "result": "Success"
          })
      } else {
          res.json({
              "result": "Data Not Found"
          }).status(202);
      }

  } catch (err) {
      console.error("Error executing SQL query", err);
      res.status(500).json({ "result": "Fail" });
  }
});

router.post("/createTask", async (req, res) => {
  try {
    const taskTitle = req.body.taskTitle;
    const taskDescription = req.body.taskDescription;
    const Priority = req.body.Priority;
    const LastDate = req.body.LastDate;
    const UserId = req.body.UserId;
    const AssignedTo = req.body.AssignedTo;
    const Status = req.body.Status;
    const result = await sql.query(
      `INSERT INTO  userTasks  (TaskTitle , TaskDescription , priority , LastDate , UserId , CreatedDate , AssignedTo , Status) values ('${taskTitle}' , '${taskDescription}' ,'${Priority}' , '${LastDate}' , ${UserId}, getdate(), '${AssignedTo}', '${Status}')`
    );
    res.json({
      result: "success",
      message: "Task succesfully added!",
    });
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.json({
      result: "Fail",
      message: "Error executing SQL query",
    });
  }
});

module.exports = router;
