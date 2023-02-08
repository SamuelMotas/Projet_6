require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
//const bodyParser = require("body-parser")
const path = require("path")
const serveStatic = require("serve-static")

// Connection to database
require("./mongo")

// Controllers
const { createUser, logUser } = require("./controllers/users")
const { getSauces, createSauces} = require("./controllers/sauces")

// Middlleware
app.use(cors())
app.use(express.json())
/*app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static("public/images"))*/

const {authenticateUser} = require("./middleware/auth")
/*const multer = require("multer")
const storage = multer.diskStorage({destination: "images/", filename: makeFilename})
const upload = multer({storage: storage})*/

/*function makeFilename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
}*/

// Routes
app.post("/api/auth/signup", createUser) //ajout de l'utilisateur à la base de données,
app.post("/api/auth/login", logUser)//la route menant à l'utilisateur
app.get("/api/sauces", authenticateUser, getSauces)// la route sauce
app.post("/api/sauces", authenticateUser, createSauces)
app.get('/', (req, res) => res.send('Hello World!'))

app.use("/images", express.static(path.join(__dirname, "images")))// permet l'accès aux ressources statiques (images)
app.use(serveStatic(path.join(__dirname, "public")))

// Listen
app.listen(port, () => {
    console.log("Listening on port" + port)
})

