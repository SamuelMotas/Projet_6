//Importation du packaga Express
require('dotenv').config()
const express = require("express")
//sécurise l'application express
const helmet = require("helmet")
//Intergiciel de sécurité des applications Web.
const lusca= require ( 'lusca' )
const app = express()
const cors = require("cors")

// Middlleware
app.use(cors())//système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents
app.use(express.json())
app.use(helmet())
app.use (lusca () )

module.exports = { app, express }