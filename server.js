require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")

// Middlleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

module.exports = { app, express }