const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Give give password argument");
}
const password = process.argv[2]
const db_name = "phoneBook"

const url =
    `mongodb+srv://natnael:${password}@cluster0.roov3pj.mongodb.net/${db_name}?
    retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Person = new mongoose.model("Person", phoneBookSchema)

const person = new Person({
    name: process.argv[3],
    phone: process.argv[4]
})

if (process.argv.length < 4) {
    Person
        .find({})
        .then(people => {
            console.log("phonebook:");
            people.map(person => {
                console.log(person.name, " ", person.phone);
            })
            mongoose.connection.close()
        })
}
else {
    person
        .save()
        .then(response => {
            console.log("Person saved!");
            console.log(`added ${response.name} number ${response.phone} to ${db_name}`);
            mongoose.connection.close()
        })
}