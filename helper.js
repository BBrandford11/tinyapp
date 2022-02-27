const { urlDatabase, users } = require("./express_server");

//takes in a id of a user and the database. This function returns there list of created short urls to display 
const urlsForUser = function (id, urlDatabase) {
  const usersUrls = {};
  for (const shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      usersUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return usersUrls;
};

//takes in the email of the user and the users database. This function returs the user and key to access inside our server
const userExists = function (email, users) {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
};

//takes in the email of the user and the users database. This function returs user id thru only having email
const getUserByEmail = function (email, usersDatabase) {
  for (const user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return usersDatabase[user].id;
    }
  }
};

//takes in the email of the user and the users database. This function returs there key for accessing inside the server
const emailExists = function (email, users) {
  for (const key in users) {
    if (users[key].email === email) {
      return key;
    }
  }
};

//takes in the email of the user and the users database. This function returs there true if a user with that email already exists when registering with a email
const emailChecker = function (email, usersDatabase) {
  for (const user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

// random generator for URL Id. 
function generateRandomString(length = 6) {
  return Math.random().toString(20).substr(2, length);
}

module.exports = {
  urlsForUser,
  userExists,
  emailExists,
  emailChecker,
  getUserByEmail,
  generateRandomString
};
