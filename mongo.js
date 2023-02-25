// Database
//Importation du package mongoose
const mongoose = require("mongoose");// on importe monogoose dans le fichier
const uniqueValidator = require("mongoose-unique-validator")// ameliore les messages d'erreur lors de l'enregistrement

const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const adress= process.env.DB_ADRESS
const uri = `mongodb+srv://${username}:${password}${adress}${db}`;


//connect à mongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connecté à Mongo!"))
    .catch(() => console.log("Erreur de connexion à Mongo! "))//permet d'être connecté à mongoDB

//on créé un schéma de données
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },//contient les champs souhaités
    password: { type: String, required: true, }
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = { mongoose, User }//on exporte mongoose