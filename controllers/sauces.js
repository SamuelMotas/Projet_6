const mongoose = require("mongoose")//importe mongoose dans le fichier
const { unlink } = require("fs/promises")

//on créée le modele du produits
const sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const Product = mongoose.model("Product", sauceSchema)

//quand l'utilisateur est enregistré il peut aller dans la page add sauces et sélectionner son produit
function getSauces(req, res) {
    Product.find({}).then(products => res.send(products))
        .catch(error => res.status(500).send(error))
}

function getSauce(req, res) {
    const { id } = req.params //on recupère l'id
    return Product.findById(id)
}

function getSauceById(req, res) {
    getSauce(req, res)
        .then((product) => sendClientResponse(product, res))
}

//fonction qui supprime le produit de la base de données
function deleteSauce(req, res) {
    const { id } = req.params //on recupère l'id
    Product.findByIdAndDelete(id)
        .then((product) => {
            if (product == null) {
                console.log("nothing to update")
                res.status(404).send({ messsage: "Object not found in database" })
            }
            else if (product.userId != req.userId) {
                res.status(403).send({ message: "pas autorisé" })
            }
            else {
                res.status(200).send(product)
                deleteImage(product)
                console.log("FILE DELETED", res)
            }
        })
        .catch((err) => res.status(500).send({ message: err }))// si ya un probleme fera un catch
}

function modifySauces(req, res) {
    const {
        params: { id } //Quand il reçoit une requête on va chercher l'id
    } = req

    const hasNewImage = req.file != null //regarde si il ya un req.file
    const payload = makePayload(hasNewImage, req)//on fabrique un payload

    //update the database
    Product.findByIdAndUpdate(id, payload)
        .then((product) => {
            if (product == null) {
                console.log("nothing to update")
                res.status(404).send({ messsage: "Object not found in database" })
            } else if (product.userId != req.userId) {
                res.status(403).send({ message: "pas autorisé" })
            }
            else {
                console.log("ALL GOOD UPDATING:", product) //si tout se passe bien
                res.status(200).send(product)
                deleteImage(product)
                console.log("FILE DELETED")
            }
        })//une fois le produit trouve il est envoyé à une fonction
        .catch((err) => console.error("PROBLEM UPDATING", err))
}

function deleteImage(product) {
    if (product == null) return
    console.log("DELETE IMAGE", product)
    const imageToDelete = product.imageUrl.split("/").at(-1)//permet de sélectionner à partir de la derniere image avec .split et .at
    return unlink("images/" + imageToDelete)
}

//fonction qui fabrique un payload(charge utile)
function makePayload(hasNewImage, req) {
    console.log("hasNewImage:", hasNewImage)
    if (!hasNewImage) return req.body //si il n'y a pas de nouvel image on renvoit req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log("nouvelle image à gerer");
    console.log("voici le payload:", payload)
    return payload
}

//fonction donnant une reponse au client en fonction de la database(db)
function sendClientResponse(product, res) {
    if (product == null) {
        console.log("nothing to update")
        res.status(404).send({ messsage: "Object not found in database" })
    } else {
        console.log("ALL GOOD UPDATING:", product) //si tout se passe bien
        res.status(200).send(product)
    }
}

//on fait la function qui fera apparaître l'imageURL
function makeImageUrl(req, filename) {
    return req.protocol + "://" + req.get("host") + "/images/" + filename
}

//on créée le produit 
function createSauces(req, res) {
    const { body, file } = req
    const { filename } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, filename),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product
        .save()
        .then((message) => {
            res.status(201).send({ message: message })
            return console.log("produit enregistré", message)
        }).catch(console.error)// enregistre le produit
}

function likeSauce(req, res) {
    getSauce(req, res)
        .then((product) => {
            console.log("the product to like is:", product)
        })
    const { userId } = req.body
}

module.exports = { getSauces, createSauces, getSauceById, deleteSauce, modifySauces, likeSauce }

//supprime la base de données
//Product.deleteMany({}).then(console.log).catch(console.error)