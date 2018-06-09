const mongoose = require('mongoose')
require('dotenv').config()

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds147450.mlab.com:47450/fullstack-application`

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person