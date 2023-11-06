const sql = require('mssql')
const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT
const countryApi = require('./routers/country')
const loginApi = require('./routers/login') 
const signupApi = require('./routers/signUp') 
const otpApi = require('./routers/otp') 
const forgotapi = require('./routers/forgot') 
const checkUser = require('./routers/checkUser') 
const tasks = require('./routers/tasks')
const users = require('./routers/users')
const dbConnection = require('./db')
const cors = require('cors');

app.use(cors())
dbConnection()
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/',countryApi)
app.use('/login',loginApi)
app.use('/signup',signupApi)
app.use('/otp',otpApi)
app.use('/forgot',forgotapi)
app.use('/checkUser',checkUser)
app.use('/tasks',tasks)
app.use('/users',users)

app.listen(port,()=>{
    console.log('app Listening on port '+port)
})

