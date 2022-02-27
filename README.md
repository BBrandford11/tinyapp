# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Created url's"](https://github.com/BBrandford11/tinyapp/blob/master/docs/urls-page.png?raw=true)

!["Registration"](https://github.com/BBrandford11/tinyapp/blob/master/docs/register.png?raw=true)

!["Tiny url"](https://github.com/BBrandford11/tinyapp/blob/master/docs/tinyurl.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How to use TinyApp

###### Register and Login
- If you are a new user you will need to register with your email and your chosen password.
- all passwords are fully hashed to protect the user from cyber attacks.
- upon registering/login you will automatically be given an encrypted cookie directly to your browser.
###### How to create a new short link
- Enter localHost:8080 in your browser to view the app
- Click on new short link in the header and submit a full url to receive your shortened version.
- Click on My Uls for a complete list of your own shortened versions of the url you submitted.
- Edit and delete any of your own links from this page as well!  