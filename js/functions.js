// --- functions ---
const fs     = require("fs");
const bcrypt = require("bcrypt");

function registerUser(user, pass, res) {
  fs.readFile('users/users.json',(err, users) => {
    var result = 400;
  	let check = true;
    var data;
		data = JSON.parse(users)
	
    var userData = {
        id: createID(),
        username: user,
        password: encryptPass(pass)
    }
  	
  	data.forEach(json => {
  	  if(json["username"] == user) {
  	    check = false;
  	  }
  	})
    
    if(check == true) {
      data.push(userData);
      json = JSON.stringify(data);
      
    	fs.writeFile('users/users.json', json, 'utf8', err => {
    		if(err) throw err;
    	})
    	result = 200
    }
  	console.log(result)
  	res.status(result)
  	if(result == 200) {
  	  res.send("done")
  	  res.end()
  	} else {
  	  res.send("error")
  	  res.end()
  	}
  })
}

function createID() {
  return random(1, 999999)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}


function encryptPass(pass) {
  let salt = bcrypt.genSaltSync(12);
  let hash = bcrypt.hashSync(pass, salt);
  return hash;
}

function checkPass(user, pass, res) {
  fs.readFile("users/users.json",(err,data)=> {
    if(err) throw err;
    
    users = JSON.parse(data);
    
    let check = false;
    let info;
    users.forEach((json, i) => {
      let equal = bcrypt.compareSync(pass, json["password"]);
      
      if(equal && json["username"] == user){
        info = users[i];
        check = true;
      }
    })
    
    if (check) {
      res.status(200);
      let cookie = encryptPass(JSON.stringify(info.id))
      res.cookie("id", cookie, { maxAge: 900000, httpOnly: true })

      res.end();
    } else {
      res.status(400)
      res.end()
    }
  })
}



module.exports = {registerUser, createID, random, checkPass}