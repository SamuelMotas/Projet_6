const jwt = require("jsonwebtoken")

// fonction permettant d'autentifier l'utilisateur
function authenticateUser(req, res, next) {
    //console.log("authenticate user")
    const header = req.header("Authorization")
    if (header == null) return res.status(401).send({ message: "invalide" })

    const token = header.split(" ")[1]
    if (token == null) return res.status(401).send({ message: "Le token ne peut pas être nul" })

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Token invalide" + err })
       // console.log("le token est bien valide, on continue")
        req.userId = decoded.userId
        next()
    })
}

module.exports = {authenticateUser}