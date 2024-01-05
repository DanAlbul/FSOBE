import mongoose from "mongoose"

// use the password provided as an argument to connect to the database
const password = process.argv[2]

// define the url for the database
const url =
   `mongodb+srv://dalbul_fullstackopen:${password}@fsomongo.jbzl554.mongodb.net/Phonebook?retryWrites=true&w=majority`

// connect to the database
mongoose.set("strictQuery",false)
mongoose.connect(url)

const processUserInput = (name, number) => {
  // Validate the user input
  if (process.argv.length === 2) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    mongoose.connection.close()
    return
  } else if (process.argv.slice(3).length !== 2 && process.argv.length !== 3) {
    console.log("Please provide the password, name, and number as arguments: node mongo.js <password> <name> <number>")
    mongoose.connection.close()
    return
  } else if (process.argv.length === 3) {
    Person.find({}).then(result => {
      if (result.length === 0) {
        console.log("Phonebook is empty")
        mongoose.connection.close()
        return
      }
      console.log("Phonebook:")
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
      return
    }).catch(error => {
      console.log(error)
      mongoose.connection.close()
      return
    })
    return
  }

  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log("added", result.name, "number", result.number, "to phonebook")
    mongoose.connection.close()
  })
}

// define the person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)
const personName = process.argv[3]
const personNumber = process.argv[4]


processUserInput(personName, personNumber)
