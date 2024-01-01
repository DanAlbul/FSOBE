import express from 'express';

const app = express();
app.use(express.json());

const PORT = '3004';
const hostname = `http://localhost:${PORT}`;

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});

app.listen(PORT, () => {
	console.log(`Server running at ${hostname}/`);
});
