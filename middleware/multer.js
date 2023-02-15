const multer = require("multer")// on a importé multer
//va dans le dossier image
const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) { //nommé un fichier 
        cb(null, makeFilename(req, file))
    }
})

function makeFilename(req, file) {
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")//nom du fichier et la date, le .replace() pour mettre des tirets entre les caractères
    file.fileName = fileName
    return fileName
}

const upload = multer({ storage })//permet de gerer le upload d'images

module.exports = { upload } //on export