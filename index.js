const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('post-log', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-log'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const length = persons.length
    const time = Date()
    res.send(`<p>Phonebook has info for ${length} people</p>  <p>${time}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id == id)
    if (!person) {
        res.status(404).end()
    } else (
        res.send(person)
    )
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const id = Math.floor(Math.random() * 100_000_000)
    const notMissing = undefined || (body.name && body.number)
    if (notMissing) {
        if (persons.find(p => p.name === body.name)) {
            res.status(400).json({
                error: 'name must be unique'
            }).end()
        }
        else {
            const new_person = {
                id: id,
                name: body.name,
                number: body.number
            }
            persons = persons.concat(new_person)
            res.json(new_person)
        }
    }
    else {
        res.status(400).json({
            error: 'Name or number missing'
        })
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on", PORT);
})