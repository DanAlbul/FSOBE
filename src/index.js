import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import dotenv from 'dotenv';
import Person from './models/person.js'

const app = express();
dotenv.config();

const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :data';
morgan.token('data', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(express.static('dist'))
app.use(morgan(customMorganFormat));
app.use(cors());

const PORT = process.env.PORT || 3004;
const hostname = `http://localhost:${PORT}`;

app.listen(PORT, () => {
	console.log(`Server running at ${hostname}/`);
});


/* let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
 */

app.get('/', (req, res) => {
	return res.send('<h1>Phonebook</h1>');
});

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
    return res.status(200).json(persons).end()
  })
});

app.get('/info', (req, res) => {
	Person.find({}).then(persons => {
		const entries = Object.entries(persons)
		const today = new Date()
		const infoPage = `<p>Phonebook has info for ${entries.length} people</p><p>${today}</p>`
		return res.send(infoPage).end()
	})
});


app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then(person => {
		if (person) {
			return res.json(person).end()
		} else {
			return res.status(404).send(`Number by id ${id} is not found`).end()
		}
	})
})


app.delete('/api/persons/:id', (req, res) => {
	console.log(req.params.id)
	Person.findByIdAndDelete(req.params.id).then(person => {
		if (person === null) return res.status(404).send(`Number by id ${req.params.id} is not found`).end()
		else return res.status(204).send(`Person with id: ${req.params.id} was deleted successfully`).end()
	}).catch(error => {
		console.log(error)
		return res.status(500).end()
	})
})

app.post('/api/persons', (req, res) => {
	const data = req.body
	const newNumber = new Person({
		name: data.name,
		number: data.number,
	})

	if(Object.values(data).some(v => v === ''))
		return res.json({error: 'Some content is missing!'}).end()

	if(!isNaN(data.name))
		return res.json({error: 'Name must be a string!'}).end()

	if(isNaN(data.number))
		return res.json({error: 'Number must consists of digits!'}).end()

	newNumber.save().then(p => res.json(p).end())
})
