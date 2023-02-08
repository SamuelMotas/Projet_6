const mongoose = require("mongoose")//importe mongoose dans le fichier

//on créée le modele du produits
const productSchema = new mongoose.Schema({
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
const Product = mongoose.model("Product", productSchema)

//quand l'utilisateur est enregistré il peut aller dans la page add sauces et sélectionner son produit
function getSauces(req, res) {
    console.log("le token a été validé, nous sommes dans getSauces")
    //console.log("le token a l'air bon", decoded)
    Product.find({}).then(products => res.send(products))
    // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })
}

//on créée le produit 
function createSauces(req, res) {
    console.log("req:", req.body)
    const product = new Product({
        userId: "pouet",
        name: "pouet",
        manufacturer: "pouet",
        description: "pouet",
        mainPepper: "pouet",
        imageUrl: "pouet",
        heat: "pouet",
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product.save().then((res) => console.log("produit enregistré", res)).catch(console.error)// enregistre le produit
}

module.exports = { getSauces, createSauces }