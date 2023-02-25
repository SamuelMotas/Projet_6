const { User } = require("../mongo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//fonction qui enregistre les informations de l'utilisateur enregistré
async function createUser(req, res) {
    try {
        const { email, password } = req.body
        const hashedPassword = await hashdPassword(password)
        const user = new User({ email: email, password: hashedPassword })
        await user.save()

        res.status(201).send({ message: "utlisateur enregistré !" })

    } catch (err) {
        res.status(409).send({ message: "Utilisateur pas enregistré :" + err })
    }//si la requête est rejeté ca envoie ce message*/
}

//fonction pour hasher le mot de passe
function hashdPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)// la méthode hash() crypt le mot de  passe
}

// fonction permettant de récuperer l'email et le password
async function logUser(req, res) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        const isPasswordOk = await bcrypt.compare(password, user.password)
        if (!isPasswordOk) {
            res.status(401).send({ message: "Mot de passe incorect" })// bad request
        }
        const token = createToken(email, user._id)
        res.status(200).send({ userId: user._id, token: token })// la requête a été réussie
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "Erreur interne" })//le navigateur n'a pas pu être traitée pour une raison non identifiée
    }
}

//on créée le token
function createToken(email, userId) {
    const jwtPassword = process.env.JWT_PASSWORD// la chaîne secrète du mot de passe
    return jwt.sign({ email: email, userId: userId }, jwtPassword, { expiresIn: "24h" })//retourne un nouveau token, et on definit la durée à 24heures
}

module.exports = { createUser, logUser }