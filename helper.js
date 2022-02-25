const { urlDatabase, users } = require("./express_server")

const urlsForUser = function(id, urlDatabase) {
  const usersUrls = {}
  for (const shortUrl in urlDatabase) {
    if(urlDatabase[shortUrl].userID === id) {
      usersUrls[shortUrl] = urlDatabase[shortUrl]
    }
  }
  return usersUrls

}
const userExists = function (email, users) {  //loop to check if email already exitsts
  for (let key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
};
const getUserByEmail = function (email, usersDatabase) {
  for (const user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return usersDatabase[user].id;
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

const emailChecker = function (email, usersDatabase) {
  for (const user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  urlsForUser,
  userExists,
  emailExists,
  emailChecker,
  getUserByEmail
}