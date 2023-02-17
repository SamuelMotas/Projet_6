// Database
const mongoose = require("mongoose");// on importe monogoose dans le fichier
const uniqueValidator = require("mongoose-unique-validator")// ameliore les messages d'erreur lors de l'enregistrement

const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri = `mongodb+srv://${username}:${password}@cluster0.mv7fhvj.mongodb.net/${db}`;


mongoose.connect(uri).then(() => console.log("Connecté à Mongo!")).catch(() => console.log("Error connecting to mongo: "))//permet d'être connecté à mongoDB

//on créé un schéma de données
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},//contient les champs souhaités
    password: {type: String, required: true,}
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}//on exporte mongoose