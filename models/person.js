const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('dotenv').config()

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds147450.mlab.com:47450/fullstack-application`

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