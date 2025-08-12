const mongoose = require('mongoose');

const argvLen = process.argv.length;
if (argvLen < 4) {
	console.error('Please provide the username and password as an argument: node mongo.js <username> <password>');
	process.exit(1);
}

const user = process.argv[2];
const password = process.argv[3];
const url = `mongodb+srv://${user}:${password}@cluster-fullstackopen.ce7xo32.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-fullstackopen`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema(
	{
		name: String,
		number: String
	}
)

const Contact = mongoose.model('Contact', contactSchema);

if (argvLen == 4) {
	console.log('phonebook:');
	Contact
		.find({})
		.then(contacts => {
			contacts.forEach(c => console.log(c.name, c.number));
			mongoose.connection.close();
		});
}
else if (argvLen == 6) {
	const contact = new Contact({
		name: process.argv[4],
		number: process.argv[5]
	});
	contact
		.save()
		.then(() => {
			console.log(`added ${contact.name} number ${contact.number} to phonebook`);
			mongoose.connection.close();
		});
}
else {
	console.error('Please provide the name and number as an argument: node mongo.js <username> <password> <name> <number>');
	process.exit(1);
}