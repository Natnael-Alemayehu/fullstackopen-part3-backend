require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/people')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('post-log', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-log'))

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(returned => {
            res.json(returned)
        })
})

app.get('/info', (req, res) => {

    const time = Date()
    res.send(`<p>Phonebook has info for ${length} people</p>  <p>${time}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(person)
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log("Body: ", body);
    if (body === undefined) {
        return res.status(400).json({ error: "Content missing" })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person
        .save()
        .then(savedNote => {
            res.json(savedNote)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server running on", PORT);
})