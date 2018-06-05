const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))

const PORT = 3001

let persons = [{
	"name": "Arto Hellas",
	"number": "040-123456",
	"id": 1
}, {
	"name": "Martti Tienari",
	"number": "040-123456",
	"id": 2
}, {
	"name": "Arto Järvinen",
	"number": "040-123456",
	"id": 3
}, {
	"name": "Lea Kutvonen",
	"number": "040-123456",
	"id": 4
}]

app.get('/api/persons', (req, res) => {
	res.json(persons)
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
		return res.status(400).json({ error: `Field 'name' must be given a value` }).end()
	}
	if (!req.body.number || req.body.name === '') {
		return res.status(400).json({ error: `Field 'number' must be given a value` }).end()
	}
	if (persons.find(p => p.name === req.body.name)) {
		return res.status(422).json({ error: `Duplicate name. '${req.body.name}' already exists`}).end()
	}
	const person = {
		name: body.name,
		number: body.number,
		id
	}
	persons = persons.concat(person)
	res.json(person)
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})