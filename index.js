require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/people')
const errors = require('./error/errors')
const app = express()


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('post-log', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-log'))

app.get('/api/persons', (req, res, next) => {
    Person
        .find({})
        .then(returned => {
            res.json(returned)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(length => {
            const time = Date()
            res.send(`<p>Phonebook has info for ${length} people</p>  <p>${time}</p>`)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log('Body: ', body)
    if (body === undefined) {
        return res.status(400).json({ error: 'Content missing' })
    }
    else if (!body.name || !body.number) {
        next(errors.PostingError)
    }
    else {
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person
            .save()
            .then(savedNote => {
                res.json(savedNote)
            })
            .catch(error => next(error))
    }
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then(response => {
            console.log(`${response.name} has been deleted`)
            res.status(204).json({ success: 'Deleted' }).end()
        })
        .catch(error => {
            next(error)
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const updated_person = {
        name: body.name,
        number: body.number
    }
    Person
        .findByIdAndUpdate(req.params.id, updated_person, { new: true, runValidators: true })
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

const notFound = (req, res) => {
    res.status(404).send({ error: 'Unknown Endpoint' })
}

const handleError = (err, req, res, next) => {
    console.log(err)
    if (err.name === 'CastError') {
        res.status(400).json({ error: 'Wrong request' }).end()
    }
    if (err.name === 'PostingError') {
        res.status(400).json({ error: 'Something went wrong while posting' }).end()
    }
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message }).end()
    }
    next(err)
}

app.use(notFound)
app.use(handleError)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running on', PORT)
})