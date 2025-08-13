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

app.get("/api/contacts", (req, res, next) => {
	Contact
		.find({})
		.then(contacts => res.json(contacts))
		.catch(error => next(error));
});

app.get('/api/contacts/:id', (req, res, next) => {
	Contact
		.findById(req.params.id)
		.then(contact => {
			if (contact)
				res.json(contact);
			else
				res.status(404).end();
		})
		.catch(error => next(error));
});

app.delete('/api/contacts/:id', (req, res, next) => {
	Contact
		.findByIdAndDelete(req.params.id)
		.then(() => res.status(204).end())
		.catch(error => next(error));
});

app.post('/api/contacts', (req, res, next) => {
	const contact = req.body;

	Contact
		.find({name: contact.name})
		.then(existingContact => {
			if (existingContact.length > 0)
				return res.status(400).json({
					error:  "name must be unique"
				});
			else {
				const newContact = new Contact({
					name: contact.name,
					number: contact.number
				});
				newContact
					.save()
					.then(savedContact => res.json(savedContact))
					.catch(error => next(error));
			}
		})
		.catch(error => next(error));
});

app.put('/api/contacts/:id', (req, res, next) => {
	const contact = req.body;
	Contact
		.findByIdAndUpdate(
			req.params.id,
			contact,
			{new: true}
		)
		.then(updatedContact => res.json(updatedContact))
		.catch(error => next(error));
});

app.get("/info", (req, res, next) => {
	Contact
		.countDocuments()
		.then(count => res.send(
			`<p>Phonebook has info for ${count} people</p>\
			<p>${new Date()}</p>`
		))
		.catch(error => next(error));
});

const errorHandler = (err, req, res, next) => {
	console.error(err.message);

	if (err.name === 'CastError')
		return res.status(400).send({error: "malformatted id"});
	else if (err.name === 'ValidationError')
    	return res.status(400).json({ error: err.message })
	else
		return res.status(500).send({error: err.message});
};
app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});