import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("connecting to MongoDB...")

mongoose.connect(url)
  .then(result => {
    console.log(result, "\nconnected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

//-----------------------PERSON---------------------------------
// define the person schema and create a model
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minLength: 2,
    required: [true, "Name is required"]
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\d{2,5}-\d{2,10}$/.test(value)
      },
      message: "Invalid phone number format. Valid format: 2-5 digits separated by '-' and another 2-10 digits\n380-2345235, 23-25262452, 45664-23456."
    },
    minLength: 8,
    required: [true, "Phone number is required"]
  },
})
// change the format of the returned object to remove the _id and __v properties and replace _id with id
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model("Person", personSchema)

export default Person
