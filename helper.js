const { urlDatabase, users } = require("./express_server")

const urlsForUser = function(id) {
  const usersUrls = {}
  for (const shortUrl in urlDatabase) {
    if(urlDatabase[shortUrl].userID === id) {
      usersUrls[shortUrl] = urlDatabase[shortUrl]
    }
  }
  return usersUrls

}

const userExists = function (email) {  //loop to check if email already exitsts
  for (let key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
};

const emailExists = function (email) {  //loop to check if email already exitsts
  for (let key in users) {
    if (users[key].email === email) {
      return key;
    }
  }
};

module.exports = {
  urlsForUser,
  userExists,
  emailExists
}