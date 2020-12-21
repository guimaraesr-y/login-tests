const xh = new XMLHttpRequest();
xh.open("GET", "/user-data", false);
xh.send();

let data = JSON.parse(xh.responseText)
let header = document.getElementById("head");

header.innerHTML += "<h1>Hello "+data.username+"!</h1>";