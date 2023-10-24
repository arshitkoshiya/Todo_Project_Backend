const sql = require('mssql')
var router = require("express").Router();
const jwt = require('jsonwebtoken');
let jwtSecretKey = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt');
var checkAttempts = require('../middleware/checkAttempts')
// Store login attempts and their timestamps
const loginAttempts = new Map();

// Maximum number of allowed login attempts
const maxLoginAttempts = 3;

// Delay (in milliseconds) before allowing further login attempts after exceeding maxLoginAttempts
const loginDelay = 60000;


// Login User API   POST--REQUEST
router.post('/', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const now = Date.now();
        const check = await sql.query(`select * from userlogin where username = '${username}'`)

        if (loginAttempts.has(username) && loginAttempts.get(username).attempts >= maxLoginAttempts) {
            const lastAttemptTime = loginAttempts.get(username).timestamp;
            const timeSinceLastAttempt = now - lastAttemptTime;

            if (timeSinceLastAttempt < loginDelay) {
                // Too many login attempts within the delay period
                const remainingTime = loginDelay - timeSinceLastAttempt;
                return res.json({
                    result:"Too many attempts",
                    error: `Too many login attempts. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
                    retryAfter: Math.ceil(remainingTime / 1000)
                });
            } else {
                // Reset the login attempts counter
                loginAttempts.delete(username);
            }
        }


        if (check.recordset.length >= 1) {
            const user = check.recordset[0]
            bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
                if (bcryptErr) {
                    console.error('Bcrypt error:', bcryptErr);
                    res.json({
                        result: 'Fail',
                        message: 'Internal server error'
                    });
                    return;
                }

                if (bcryptResult) {
                    // Passwords match, authentication successful
                    let data = {
                        username: username,
                        password: password,
                    }
                    const token = jwt.sign(data, jwtSecretKey);
                    const createdOn = user.createdOn
                    res.json({
                        result: 'Success',
                        message: 'Authentication successful. Welcome!',
                        data: {
                            token: token,
                            username: user.username,
                            createdOn: createdOn
                        }
                    });
                } else {
                    // Passwords do not match
                    // Failed login attempt
                    if (!loginAttempts.has(username)) {
                        loginAttempts.set(username, { attempts: 1, timestamp: now });
                    } else {
                        loginAttempts.get(username).attempts++;
                    }
                    res.json({
                        result: 'Fail',
                        message: 'Incorrect credentials provided'
                    });
                }
            });
        } else {
            res.json({
                result: 'Fail',
                message: 'Authentication failed. Please verify your information.'
            });
        }
    } catch (err) {
        console.error("Error executing SQL query", err);
        res.json({
            result: "Fail",
            message: "Error executing SQL query"
        });
    }
})

module.exports = router;
