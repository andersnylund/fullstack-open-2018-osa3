const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
const People = require('./models/people')

app.use(bodyParser.json())
morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
	People
		.find({})
		.then(people => res.json(people.map(formatPerson)))
})

app.get('/info', (req, res) => {
	const message = `<p>puhelinluettelossa ${persons.length} henkilön tiedot<p><p>${new Date()}<p>`
	res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		persons = persons.filter(p => p.id !== id)
		res.status(204).end()
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	const id = Math.floor(Math.random() * 10000000000)
	if (!req.body.name || req.body.name === '') {
		return res.status(400).json({
			error: `Field 'name' must be given a value`
		}).end()
	}
	if (!req.body.number || req.body.name === '') {
		return res.status(400).json({
			error: `Field 'number' must be given a value`
		}).end()
	}
	if (persons.find(p => p.name === req.body.name)) {
		return res.status(422).json({
			error: `Duplicate name. '${req.body.name}' already exists`
		}).end()
	}
	const person = {
		name: body.name,
		number: body.number,
		id
	}
	persons = persons.concat(person)
	res.json(person)
})

const formatPerson = (person) => {
	console.log(person._doc)
	const formattedPerson = { ...person._doc, id: person._id }
	delete formattedPerson._id
	delete formattedPerson.__v
	return formattedPerson
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})