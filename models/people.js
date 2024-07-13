const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log("Connecting to MongoDB");
mongoose.connect(url)
    .then(response => {
        console.log("MondoDB connected successfully");
    })
    .catch(error => {
        console.log("Error has occurred: ", error);
    })

const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/g.test(v);
            }
        },
        required: true
    },
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model("Person", phoneBookSchema)
