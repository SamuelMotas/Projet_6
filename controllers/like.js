const { getSauce, sendClientResponse } = require("./sauces")

function likeSauce(req, res) {
    const { like, userId } = req.body
    if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "Invalid like value" })

    getSauce(req, res)//il fait un get du product
        .then((product) => updateVote(product, like, userId, res))//ensuite il update
        .then((pr) => pr.save())//il sauve le produit dans la base de données
        .then(prod => sendClientResponse(prod, res))//envoie une réponse
        .catch((err) => res.status(500).send(err))// sauf en cas d'erreur
}

//verifie si les likes sont égale à 1,0,-1
function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, userId, like)
    return resetVote(product, userId, res)
}

function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product
    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
        return Promise.reject("l'Utilisateur semble avoir voter dans les 2 sens")

    if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
        return Promise.reject("L'utilisateur ne semble pas avoir votés")

    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter(id => id !== userId)
    } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter(id => id !== userId)
    }
    return product
}

function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product //il va chercher les arrays usersdiliked et userslike dans le produit

    const votersArray = like === 1 ? usersLiked : usersDisliked//si on cherche à faire un like
    if (votersArray.includes(userId)) return product
    votersArray.push(userId)//on push le userId dans l'array

    like === 1 ? ++product.likes : ++product.dislike
    return product
}

module.exports = { likeSauce }