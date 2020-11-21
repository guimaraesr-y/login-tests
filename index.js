const express    = require('express');
const bcrypt     = require('bcrypt');
const bodyParser = require("body-parser");
const fs         = require('fs');
const app        = express();
const port       = 8000;

app.use(bodyParser.json());

app.get('/', (req, res) => { // for login
	fs.readFile('./public/index.html', (err, html) => {
		if(err) throw err;
		res.writeHeader(200);
		res.write(html)
		res.end();
	})
})

app.get('/register', (req, res) => { // for register
	fs.readFile('./public/register.html', (err, html) => {
		if(err) throw err;
		res.writeHeader(200);
		res.write(html)
		res.end();
	})
})

app.post('/auth_login/', (req, res) => {
	console.log(req.body);
	res.status(200);
	res.end();
})

app.get('/me', (req, res) => {

})

function checkPassword(user, pass) {
	const saltRounds = 12;

	fs.readFile('users.json', (err, users) => {
		u = JSON.parse(users)
		u.push('asdadadsd')

		fs.writeFile('users.json', JSON.stringify(u), 'utf8', err => {
			if(err) throw err
		})
	})
}
checkPassword(1, 2)

app.listen(port, () => {
	console.log('[+] Server listening on port', port);
})