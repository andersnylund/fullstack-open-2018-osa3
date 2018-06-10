const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('dotenv').config()

const url = `mongodb://user:secret@localhost:27017`

mongoose.connect(url)

const personSchema = new Schema({
  name: String,
  number: String
})

personSchema.statics.format = (person) => {
  const formattedPerson = {
    ...person._doc,
    id: person._id
  }
  delete formattedPerson._id
  delete formattedPerson.__v
  return formattedPerson
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person