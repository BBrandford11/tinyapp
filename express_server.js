const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = {
  123: {
    email: "test@lhl.com",
    password: 456,
    id: 123,
  },
};

const idFromUsers = function (id) {
  for (const user in users) {
    if (users[user].id === id) {
      return true;
    }
  }
  return false
};

const urlsForUser = function(id) {
  const usersUrls = {}
  for (const shortUrl in urlDatabase) {
    if(urlDatabase[shortUrl].userID === id) {
      usersUrls[shortUrl] = urlDatabase[shortUrl]
    }
  }
  return usersUrls

}

const userExists = function (email, password) {  //loop to check if email already exitsts
  for (let key in users) {
    if (users[key].email === email && users[key].password === password) {
      return key;
    }
  }
};

const emailExists = function (email) {  //loop to check if email already exitsts
  for (let key in users) {
    if (users[key].email === email) {
      return key;
    }
  }
};
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
app.get("/urls/new", (req, res) => {  // new url
  if (!req.cookies.userId) {
    res.redirect("/login")
  }
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  const templateVars = {
    urlDatabase,
    user,
  };
  res.render("urls_new", templateVars);
});
app.get("/urls", (req, res) => {  // main render to url
  
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  const filtered = urlsForUser(req.cookies.userId)
  console.log("Filetered urls", filtered)
  const templateVars = {
    urls: filtered,
    user };
  res.render("urls_index", templateVars);
});

app.post("/register", (req, res) => {  //post to register adding new user and cookie
  const { email, password } = req.body;
  const id = generateRandomString();
  if (!email || !password) {
    return res.status(400).send("Bad Request");
  }

  if (emailExists(email)) {
    return res.status(400).send("Bad Request");
  }

  users[id] = { email, password, id };
  res.cookie("userId", users[id].id);
  res.redirect("/urls");
});

app.get("/register", (req, res) => {  // get to register
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  const templateVars = { urls: urlDatabase, user };
  res.render("register", templateVars);
});
app.post("/urls", (req, res) => {  // create new url!!!!!!!!!!!!!!!!!!!!!!!
  console.log(req.body, "FUCKING HERE");
  const cookieId = req.cookies.userId;
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: cookieId,
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {  //delete a url;
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL]
  if (!url) {
    return res.status(400).send("Bad Request");
  }
  const longURL = urlDatabase[shortURL].longURL;
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  
  if (!user || urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send("You dont have permission to do that!");
  }
 
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {  //edit a url;
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL]
  if (!url) {
    return res.status(400).send("Bad Request");
  }
  const longURL = urlDatabase[shortURL].longURL;
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  
  if (!user || urlDatabase[shortURL].userID !== user.id) {
    return res.status(401).send("You dont have permission to do that!");
  }
 
 
  const newURL = req.body.longURL;
  console.log("update", newURL);
  urlDatabase[shortURL].longURL = newURL;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {  // get to login
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  const templateVars = { urls: urlDatabase, user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {  //login post;
  const { email, password } = req.body;
  console.log("awdsd", req.body);
  const user = userExists(email, password);
  if (!email || !password) {
    return res.status(400).send("Bad Request");
  }

  if (!user) {
    return res.status(400).send("Bad Request");
  }

  res.cookie("userId", user);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {  //logout;!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  console.log("logout");
  res.clearCookie("userId");
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {  //get reqest to short url
  
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL]
  if (!url) {
    return res.status(400).send("Bad Request");
  }
  const longURL = urlDatabase[shortURL].longURL;
  const cookieId = req.cookies.userId;
  const user = users[cookieId];
  

  if (!user || urlDatabase[shortURL].userID !== user.id) {
    res.redirect("/urls")
  }
  const templateVars = {
    shortURL,
    longURL,
    user,
    urlDatabase,
  };
  res.render("urls_show", templateVars);
});
// if(!req.cookies.userId) {
//   res.redirect("login")
// } 

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

app.get("/", (req, res) => {
  // hello at base /
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  //json url
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  // basic hello world at /hello
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// random generator for URL Id
function generateRandomString(length = 6) {
  return Math.random().toString(20).substr(2, length);
}
