const express    = require('express');
const bcrypt     = require('bcrypt');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fs         = require('fs');
const app        = express();
const port       = 5000;

const jsonFuncs  = require("./js/functions.js");

app.use(bodyParser.json());
app.use(cookieParser())

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

app.get('/me', (req, res) => {
  let id = req.cookies.id;
  
  fs.readFile("users/users.json", (err,data) => {
    usersData = JSON.parse(data)
    
    usersData.forEach((json) => {
      if(bcrypt.compareSync(JSON.stringify(json.id), id)) {
        res.status(200)
        
        fs.readFile("./data/"+json.id+"/index.html", (err, html) => {
          if(err) throw err;
          
          res.write(html)
          res.end()
        })
      }
    })
  })
})


app.post('/auth_login/', (req, res) => {
	let name = req.body["username"], pass = req.body["password"];
	
	jsonFuncs.checkPass(name, pass, res)
})
app.post('/register/_auth', (req, res) => {
  let name = req.body["username"], pass = req.body["password"];
  jsonFuncs.registerUser(name, pass, res)
})





app.listen(port, () => {
	console.log('[!] Server listening on port', port);
})