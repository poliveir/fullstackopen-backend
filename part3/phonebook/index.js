const express = require('express');
var morgan = require('morgan')
const app = express();

let contacts = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
];

app.use(express.static('dist'))
app.use(express.json());
morgan.token(
	'body',
	function (req, res) {
		return JSON.stringify(req.body);
	}
)
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.get("/api/contacts", (req, res) => {
	res.json(contacts);
});

app.get('/api/contacts/:id', (req, res) => {
	const id = req.params.id;
	const contact = contacts.find(contact => contact.id === id);

	if (contact)
		res.json(contact);
	else
		res.status(404).end()
});

app.delete('/api/contacts/:id', (req, res) => {
	const id = req.params.id;
	contacts = contacts.filter(contact => contact.id !== id);
	res.status(204).end();
});

app.post('/api/contacts', (req, res) => {
	const contact = req.body;

	if (!contact.name)
		return res.status(400).json({
			error: "name is missing"
		});
	else if (!contact.number)
		return res.status(400).json({
			error:  "number is missing"
		});

	if (contacts.find(c => c.name === contact.name))
		return res.status(400).json({
			error:  "name must be unique"
		});
	const newContact = {
		...contact,
		id: Math.random().toString(12).substring(2, 11)
	};
	contacts = contacts.concat(newContact);
	res.json(newContact);
});

app.get("/info", (req, res) => {
	res.send(
		`<p>Phonebook has info for ${contacts.length} people</p>\
		<p>${new Date()}</p>`
	);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});