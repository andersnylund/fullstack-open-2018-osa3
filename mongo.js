const mongoose = require('mongoose');
require('dotenv').config();

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds147450.mlab.com:47450/fullstack-application`;

mongoose.connect(url);

const Person = mongoose.model('Person', {
  name: String,
  number: String,
});

const args = process.argv.slice(2);

if (args[0] === undefined || args[1] === undefined) {
  console.log('Puhelinluettelo:');
  Person
    .find({})
    .then((people) => {
      people.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
} else {
  const newPerson = new Person({
    name: args[0],
    number: args[1],
  });
  console.log(`Lisätään henkilö ${newPerson.name} ${newPerson.number} luetteloon`);
  newPerson
    .save()
    .then(() => {
      mongoose.connection.close();
    });
}
