const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log("Connecting to MongoDB");
mongoose.connect(url)
    .then(response => {
        console.log("MondoDB connected succesfully");
    })
    .catch(error => {
        console.log("Error has occurred: ", error);
    })

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

module.exports = mongoose.model("Person", phoneBookSchema)
