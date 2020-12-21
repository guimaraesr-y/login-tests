const express    = require('express');
const bcrypt     = require('bcrypt');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fs         = require('fs');
const app        = express();
const port       = 5000;

const jsonFuncs  = require("./js/functions.js");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("./public"))

app.get('/login', (req, res) => { // for login
	fs.readFile('./public/views/auth/login.html', (err, html) => {
		if(err) throw err;
		res.writeHeader(200);
		res.write(html)
		res.end();
	})
})

app.get('/register', (req, res) => { // for register
	fs.readFile('./public/views/auth/register.html', (err, html) => {
		if(err) throw err;
		res.writeHeader(200);
		res.write(html)
		res.end();
	})
})

app.get('/', (req, res) => {
	if (req.cookies.id == undefined) {
		res.redirect("/login");
		
	} else {
	  res.status(200);
	  res.sendFile(__dirname+"/public/views/pages/profile.html");
	}
})

app.get("/user-data", (req,res) => {
	let idUser = req.cookies.id;
  
  fs.readFile("users/users.json", (err,data) => {
    usersData = JSON.parse(data);
    
    for(let id in usersData) {
      if(bcrypt.compareSync(id, idUser)) {
        res.status(200)
        let info = usersData[id];
        info.id = id;
        
        res.send(JSON.stringify(info));
        res.end()
    	}
    }
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