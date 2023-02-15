require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")

// Middlleware
app.use(cors())
app.use(express.json())

module.exports = { app, express }