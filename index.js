const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
const Person = require('./models/person')

app.use(bodyParser.json())
morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
	Person
		.find({})
		.then(persons => res.json(persons.map(Person.format)))
		.catch(error => console.log(error))
})

app.get('/info', (req, res) => {
	const message = `<p>puhelinluettelossa ${persons.length} henkilön tiedot<p><p>${new Date()}<p>`
	res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
	Person
		.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(Person.format(person))
			} else {
				res.status(404).send({error: 'id not found'})
			}
		})
		.catch(error => {
			console.log(error)
			res.status(400).send({error: 'malformed id'})
		})
})

app.delete('/api/persons/:id', (req, res) => {
	Person
		.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => {
			console.log(error)
			res.status(400).send({ error: 'malformed id' })
		})
})

app.post('/api/persons', (req, res) => {
	const body = req.body
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
	const person = new Person({
		name: body.name,
		number: body.number
	})
	Person
		.find({name: person.name})
		.then(persons => {
			if(persons.length !== 0) {
				res.status(409).send({error: 'name of entry already exists in list'})
			} else {
				person
					.save()
					.then(person => {
						res.json(Person.format(person))
					})
					.catch(error => console.log(error))
			}
		})
		.catch(error => {
			console.log(error)
		})
})

app.put('/api/persons/:id', (req, res) => {
	const person = req.body
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
	Person
		.findByIdAndUpdate(req.params.id, person, {new: true})
		.then(person => {
			res.json(Person.format(person))
		})
		.catch(error => {
			console.log(error)
		})
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})