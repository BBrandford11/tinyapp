const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.use(cookieParser())

const users = {
  123: {
    email: 'test@lhl.com',
    password: 456,
    id: "labs"
  }

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get("/urls/new", (req, res) => {// new url 
  const templateVars = { 
    users    
   }
  res.render("urls_new", templateVars);
});
app.get("/urls", (req,res) => { // main render to url
  const cookieId = req.cookies.userId
  const user = users[cookieId]
  const templateVars = { urls:
     urlDatabase,
     user
    }
  res.render("urls_index", templateVars)
})
app.post("/register", (req, res) => {  //post to register adding new user and cookie
  const { email, password } = req.body
  const id = generateRandomString()
  users[id] = {email, password, id}
  res.cookie("userId" ,users[id].id)
  res.redirect("/urls");
});

app.get("/register", (req,res) => { // get to register
  const cookieId = req.cookies.userId
  const user = users[cookieId]
  const templateVars = { urls:
     urlDatabase,
     user
    }
  res.render("register", templateVars)
})
app.post("/urls", (req, res) => {// create new url
  console.log(req.body);  
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {//delete a url;  
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {//edit a url;  
  const shortURL = req.params.shortURL;
  const newURL = req.body.longURL
  console.log("update", newURL)
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {//login;
  console.log(req.body)  
  const username = req.body.username
  //res.cookie("username", username)
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {//logout;
  res.clearCookie("username", req.body.username);
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => { //get reqest to short url
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL]
  const templateVars = { 
    shortURL, 
    longURL,
    users
   };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {// 404 handle
  console.log("checking")
  
  const longURL = urlDatabase[req.params.shortURL]
  if(!longURL) {
    res.send('404')
  }
  console.log("longurl: ", longURL)
  res.redirect(longURL);
  });

app.get("/", (req, res) => { // hello at base /
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {//json url
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => { // basic hello world at /hello
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// random generator for URL Id
function generateRandomString(length = 6) {
  return Math.random().toString(20).substr(2, length)
}
