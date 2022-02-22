const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase}
  res.render("urls_index", templateVars)
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

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL]
  const templateVars = { shortURL, longURL };
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

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString(length = 6) {
  return Math.random().toString(20).substr(2, length)
}
