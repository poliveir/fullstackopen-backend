const express = require('express');
var morgan = require('morgan');
const app = express();
require('dotenv').config();
const Contact = require('./models/contact');

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
	Contact
		.find({})
		.next(contacts => res.json(contacts))
		.catch(error => res.status(500).end());
});

app.get('/api/contacts/:id', (req, res) => {
	Contact
		.findById(req.params.id)
		.then(contact => {
			if (contact)
				res.json(contact);
			else
				res.status(404).end();
		})
		.catch(error => res.status(500).end());
});

app.delete('/api/contacts/:id', (req, res) => {
	Contact
		.findByIdAndDelete(req.params.id)
		.then(() => res.status(204).end())
		.catch(error => res.status(500).end());
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

	Contact
		.find({name: contact.name})
		.then(existingContact => {
			if (existingContact)
				return res.status(400).json({
					error:  "name must be unique"
				});
			else
				res.json(contact);
		})
		.catch(error => res.status(500).end());
});

app.get("/info", (req, res) => {
	res.send(
		`<p>Phonebook has info for ${contacts.length} people</p>\
		<p>${new Date()}</p>`
	);
});

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});