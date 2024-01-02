import express from 'express';
import morgan from 'morgan';
import cors from 'cors'

const app = express();

const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :data';
morgan.token('data', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(customMorganFormat));
app.use(cors());
app.use(express.json());

const PORT = '3004';
const hostname = `http://localhost:${PORT}`;

app.listen(PORT, () => {
	console.log(`Server running at ${hostname}/`);
});

const getInfo = () => {
	const entries = Object.entries(persons)
	const today = new Date()
	return (
		`<div>
			<p>Phonebook has info for ${entries.length} people</p>
			<p>${today}</p>
		</div>`
	)
}

let persons = [
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


app.get('/', (req, res) => {
	return res.send('<h1>Phonebook</h1>');
});

app.get('/api/persons', (req, res) => {
	return res.status(200).json(persons)
});

app.get('/info', (req, res) => {
	const infoPage = getInfo()
	return res.send(infoPage)
})


app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	if(isNaN(id)) return res.status(400).send('Invalid id').end()
	const number = persons.find(p => p.id === id)
	if (!number) return res.status(404).send(`Number by id ${id} is not found`).end()
	return res.json(number).end()
})


app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	if(isNaN(id)) return res.status(400).send('Invalid id').end()
  if (!persons.some(p => p.id === id))
		return res.status(404).send(`Number by id ${id} is not found`).end()

	persons = persons.filter(p => p.id !== id)
	return res.status(204).send(`Person with id: ${id} was deleted successfully`).end()
})

app.post('/api/persons', (req, res) => {
	const data = req.body

	if(Object.values(data).some(v => v === ''))
		return res.status(400).json({error: 'Some content is missing!'}).end()

	if(!isNaN(data.name))
		return res.status(400).json({error: 'Name must be a string!'}).end()

	if(isNaN(data.number))
		return res.status(400).json({error: 'Number must consists of digits!'}).end()

	if(persons.some(person => person.name === data.name))
		return res.status(400).json({error: 'Name must be unique!'}).end()

	if(persons.some(person => person.number === data.number))
		return res.status(400).json({error: 'Number must be unique!'}).end()

	const newNumber = {
		...data,
		id: Math.floor(Math.random() * 1000000000)
	}
	persons = persons.concat(newNumber)
	return res.json(newNumber).end()
})
