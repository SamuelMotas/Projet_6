//Importation du packaga Express
require('dotenv').config()
const express = require("express")
//importation du package BodyParser
//const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")

// Middlleware
app.use(cors())//mettre un commentaire
app.use(express.json())
//app.use(bodyParser.json())

module.exports = { app, express }