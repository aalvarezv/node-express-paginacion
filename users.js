const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
//Nota: por defecto el nombre del modelo User en la base mongo queda en plural y con minusculas users, debe existir un parámetro para que respete el nombre indicado
module.exports = mongoose.model('User', userSchema)