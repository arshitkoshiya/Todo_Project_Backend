const sql = require("mssql");
var router = require("express").Router();
var signupuser = require("../middleware/signup");

router.post("/", signupuser, async (req, res) => {
  function getRandomColor() {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Convert the values to a hexadecimal color code
    const color = `#${red.toString(16)}${green.toString(16)}${blue.toString(
      16
    )}`;

    return color;
  }

  const color = getRandomColor();

  try {
    const username = req.body.username;
    const password = req.body.password;
    const result = await sql.query(
      `INSERT INTO userlogin values ('${username}' , '${password}' , getdate(), '${color}')`
    );
    console.log(result);
    res.json({
      result: "success",
      message: "Account creation complete. You're good to go!",
    });
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.json({
      result: "Fail",
      message: "Error executing SQL query",
    });
  }
});

router.post("/userdata", signupuser, async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const result = await sql.query(`select username from userlogin`);
    console.log(result);
    res.json({
      result: "success",
      message: "Account creation complete. You're good to go!",
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
