const { app, express } = require("./server")
const port = 3000
const path = require("path")


// Connection to database
require("./mongo")

// Controllers
const { createUser, logUser } = require("./controllers/users")
const { getSauces, createSauces, getSauceById, deleteSauce, modifySauces, likeSauce } = require("./controllers/sauces")

// Middleware
const { upload } = require("./middleware/multer")
const { authenticateUser } = require("./middleware/auth")

// Routes
//chemin de L'API
app.post("/api/auth/signup", createUser) //ajout de l'utilisateur à la base de données,
app.post("/api/auth/login", logUser)//la route menant à l'utilisateur

app.get("/api/sauces", authenticateUser, getSauces)// la route sauce
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauces)// authentification, recup la requête avec un fichier image,création du produit
app.get("/api/sauces/:id", authenticateUser, getSauceById)
app.delete("/api/sauces/:id", authenticateUser, deleteSauce)
app.put("/api/sauces/:id", authenticateUser, upload.single("image"), modifySauces)//  la route pour modifier 
app.post("/api/sauces/:id/like", authenticateUser, likeSauce )
//app.get('/', (req, res) => res.send('Hello World!'))

// Listen
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => { console.log("Listening on port" + port) })

