const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const {
  userExists,
  emailExists,
  urlsForUser,
  generateRandomString,
} = require("./helper");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["encrypt", "decrypt"],
  })
);

// DATABASE SECTION

const users = {};
const urlDatabase = {};

// GET REQUEST SECTION

//Renders a new url page
app.get("/urls/new", (req, res) => {
  const user = users[req.session.id];

  if (!req.session.id) {
    res.redirect("/login");
  }

  const templateVars = {
    urlDatabase,
    user,
  };
  res.render("urls_new", templateVars);
});

// main render to url
app.get("/urls", (req, res) => {
  const user = users[req.session.id];
  const filtered = urlsForUser(req.session.id, urlDatabase);
  if (!user) {
    return res
      .status(400)
      .send("Please log in to see and create your own urls");
  }
  const templateVars = {
    urls: filtered,
    user,
  };
  res.render("urls_index", templateVars);
});

// get request to register
app.get("/register", (req, res) => {
  const user = users[req.session.id];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render("register", templateVars);
});

// get request to login
app.get("/login", (req, res) => {
  const user = users[req.session.id];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render("login", templateVars);
});

//get reqest to short url
app.get("/urls/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const user = users[req.session.id];

  if (!url) {
    return res.status(400).send("Invalid URL");
  }

  if (!user) {
    return res.status(400).send("Please log in to see url");
  }

  if (urlDatabase[req.params.shortURL].userID !== user.id) {
    return res.status(400).send("Please create your own url");
  }

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL,
    user,
    urlDatabase,
  };
  res.render("urls_show", templateVars);
});

//get request to id website
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const shortURLData = urlDatabase[shortURL];
  if (!shortURLData) {
    return res.status(404).send("That URL has not been created yet.");
  } else {
    const longURL = urlDatabase[shortURL].longURL;
    return res.redirect(longURL);
  }
});

// redirects from / to either login or urls
app.get("/", (req, res) => {
  if (!req.session.id) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});

//json url
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  // basic hello world at /hello
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//POST REQUEST SECTION

//post to register adding new user and cookie
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const id = generateRandomString();

  if (!email || !password) {
    return res.status(400).send("Email and password should not be empty.");
  }

  if (emailExists(email, users)) {
    return res.status(400).send("Email already exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id,
    password: hashedPassword,
    email,
  };
  req.session["id"] = id;
  res.redirect("/urls");
});

//login post;
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = userExists(email, users);

  if (!email || !password) {
    return res.status(400).send("Please fill out both email and password");
  }

  if (!user) {
    return res.status(400).send("Invalid email");
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.id = user.id;
    res.redirect("/urls");
  } else {
    return res.status(401).send("Password incorrect");
  }
});

// create new url
app.post("/urls", (req, res) => {
  const user = users[req.session.id];
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.id,
    user,
  };
  res.redirect(`/urls/${shortURL}`);
});

//delete a url;
app.post("/urls/:shortURL/delete", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  if (!url) {
    return res.status(400).send("Bad Request");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const user = users[req.session.id];

  if (!user || urlDatabase[req.params.shortURL].userID !== user.id) {
    return res.status(401).send("You dont have permission to do that!");
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//edit a url;
app.post("/urls/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  if (!url) {
    return res.status(400).send("Url does not exist");
  }
  if (req.body.longURL === "") {
    return res.status(400).send("Please enter a URL");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const user = users[req.session.id];

  if (!user || urlDatabase[req.params.shortURL].userID !== user.id) {
    return res.status(401).send("You dont have permission to do that!");
  }

  const newURL = req.body.longURL;
  urlDatabase[req.params.shortURL].longURL = newURL;
  res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
module.exports = {
  urlDatabase,
  users,
};
