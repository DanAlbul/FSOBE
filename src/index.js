import express from "express"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import Person from "./models/person.js"

const app = express()
dotenv.config()

// === MIDDLEWARES ===
const customMorganFormat = ":method :url :status :res[content-length] - :response-time ms :data"
morgan.token("data", (req) => {
  return JSON.stringify(req.body)
})


app.use(express.static("dist"))
app.use(express.json())
app.use(morgan(customMorganFormat))
app.use(cors())

// --- SERVER ---
const PORT = process.env.PORT || 3004
const hostname = `http://localhost:${PORT}`

app.listen(PORT, () => {
  console.log(`Server running at ${hostname}/`)
})


// ~~~ ROUTES ~~~

// ~ Get all persons
app.get("/api/persons", (req, res, next) => {
  Person.find({}).then(persons => {
    return res.status(200).json(persons).end()
  }).catch(error => next(error))
})

// ~ Get info
app.get("/info", (req, res, next) => {
  Person.find({}).then(persons => {
    const entries = Object.entries(persons)
    const today = new Date()
    const infoPage = `<p>Phonebook has info for ${entries.length} people</p><p>${today}</p>`
    return res.send(infoPage).end()
  }).catch(error => next(error))
})

// ~ Get person by id
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      return res.json(person).end()
    } else {
      return res.status(404).send(`Number by id "${req.params.id}" is not found`).end()
    }
  }).catch(error => next(error))
})

// ~ Remove person by id
app.delete("/api/persons/:id", (req, res, next) => {
  console.log(req.params.id)
  Person.findByIdAndDelete(req.params.id).then(person => {
    if (person === null) return res.status(404).send(`Number by id ${req.params.id} is not found`).end()
    else return res.status(204).send(`Person with id: ${req.params.id} was deleted successfully`).end()
  }).catch(error => next(error))
})

// ~ Create person by id
app.post("/api/persons", (req, res, next) => {
  const data = req.body
  const newNumber = new Person({
    name: data.name,
    number: data.number,
  })

  newNumber.save()
    .then(p => res.json(p).end())
    .catch(error => next(error))
})

// ~ Update person by id
app.put("/api/persons/:id", (req, res, next) => {
  const data = req.body
  const newNumber = {
    name: data.name,
    number: data.number,
  }

  Person.findByIdAndUpdate(req.params.id, newNumber, { new: true, runValidators: true, context: "query" })
    .then(person => {
      if (person === null) return res.status(404).send(`Number by id ${req.params.id} is not found`).end()
      else return res.json(person).end()
    }).catch(error => next(error))
})
// ~~~ END OF ROUTES ~~~

const unknownEndpoint = (req, res) => res.status(404).send({ error: "unknown endpoint" })
app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.error(error)
  if (error.name === "CastError")
    return res.status(400).send({ error: "malformatted id" })
  else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message, type: error.name })
  }
  next(error)
}
app.use(errorHandler)
