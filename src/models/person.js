import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//-----------------------PERSON---------------------------------
// define the person schema and create a model
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
  },
  number: {
    type: String,
    required: true,
    minLength: 6,
  },
})
// change the format of the returned object to remove the _id and __v properties and replace _id with id
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)

export default Person
