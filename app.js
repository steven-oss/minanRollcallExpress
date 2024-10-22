require('dotenv').config({path:'./config/env/local.env'})


const express = require('express')
const router = require('./routes')
const cors = require('cors')
const app = express()
const port = 8000

app.use(cors());

app.use(express.json())
app.use(router)

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})