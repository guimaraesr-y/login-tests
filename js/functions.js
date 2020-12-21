// --- functions ---
const fs     = require("fs");
const bcrypt = require("bcrypt");

function registerUser(user, pass, res) {
  var data, thisId = createID();
	let willwrite = true;
  
  fs.readFile('users/id.json',(err,ids)=>{
  	let idsData = JSON.parse(ids);
  	
  	for(let key in idsData) {
			if(idsData.hasOwnProperty(user)) {
				res.send("error");
	  		res.end();
	  		willwrite = false;
				break;
			}
			if(thisId == idsData[key]) {
				thisId = createID();
			}
		}
		
		if(willwrite) {
			idsData[user] = thisId;
		
			fs.writeFile("users/id.json", JSON.stringify(idsData), (err) => {
				if (err) throw err;
			})
		}
  })
  
  fs.readFile('users/users.json',(err, users) => {
  	if (willwrite) {
			data = JSON.parse(users);
			
			data[thisId] = {
				username: user, 
				password: encryptPass(pass)
			}
			
			fs.writeFile("users/users.json", JSON.stringify(data), (err) => {
				if (err) throw err;
			})
  		
		  res.send("done");
		  res.end();
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
    
    let ids = JSON.parse(fs.readFileSync("users/id.json", {encoding: "utf8", flag: "r"}));
    
    if(!ids.hasOwnProperty(user)) {
    	res.status(400)
      res.end()
    } else {
	    let thisId = ids[user];
	    
	    if(bcrypt.compareSync(pass, users[thisId].password)) {
	    	res.status(200);
	      let cookie = encryptPass(JSON.stringify(thisId));
	      res.cookie("id", cookie, {maxAge: 900000, httpOnly: true});
    	
	      res.end();
	    }
    }
  })
}



module.exports = {registerUser, createID, random, checkPass}