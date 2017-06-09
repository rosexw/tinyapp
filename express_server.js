//packages installed and other functions set up
var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
var randomPass = require("./random.js");
var protocolChecker = require("./protocolChecker.js");
var PORT = process.env.PORT || 8080;

//fix design of everything at the end, once everything is working

//body parser, cookie parser - use
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

//set global objects
var urlDatabase = {
  "b2xVn2": {
    URL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
   },
  "9sm5xK": {
    URL: "http://www.google.com",
    userID: "user2RandomID"
  },
  "abcd12": {
    URL: "http://www.thestar.com",
    userID: "userRandomID"
  },
};

var users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "test1"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "test2"
  }
}

//APP GET//
//home page - put header here as well - login and register options
app.get("/", (req, res) => {
  res.end("<html><body><h1>Welcome to TinyApp: a URL Shortener Tool!</h1></body></html>\n");
});

//maybe a nav bar or side bar once logged in??

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = {
    urls: urlsForUser(userID),
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("register");
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  if (templateVars.user) {
    res.render("urls_new");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  let urlData = urlDatabase[req.params.id];
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlData.URL,
    user: users[req.cookies["user_id"]],
    urlUserID: urlData.userID
  };
  res.render("urls_show", templateVars);
});
//redirect shortURL to long URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].URL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(400).send('<html><body>URL not found</body></html>\n');
  }
});

//APP POST//
app.post("/login", (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.status(400).send("Please enter email and/or password.");
    }
    for (var key in users) {
      if (email === users[key].email && password === users[key].password) {
        res.cookie("user_id", key);
        return res.redirect("/urls");
      }
    }
    res.status(403).send("Incorrect email and/or password.");
})

app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
});

app.post("/register", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user_id = randomPass(email);

    if (!email || !password) {
      return res.status(400).send("Please enter email and/or password.");
    }

    // Checking if user with already exists
    for (var key in users) {
      if (email === users[key].email) {
        return res.status(400).send("User already exists!");
      }
    }
    users[user_id] = {
      id: user_id,
      email: email,
      password: password
    };
    console.log(users);
    res.cookie("user_id", user_id);
    res.redirect("/urls");
});
//creates random shortURL
app.post("/urls", (req, res) => {
  var shortURL = randomPass();
  res.redirect("/urls/" + shortURL);
});

//Delete button
app.post("/urls/:id/delete", (req, res) => {
  let urlData = urlDatabase[req.params.id];
  if (req.cookies["user_id"] !== urlData.userID) {
    return res.status(403).send("Unauthorized to delete this URL.");
  }
  delete urlData;
  res.redirect("/urls");
});
//Edit button/update
app.post("/urls/:id/update", (req, res) => {
  let urlData = urlDatabase[req.params.id];
  if (req.cookies["user_id"] !== urlData.userID) {
    return res.status(403).send("Unauthorized to edit this URL.");
  }
  var newLongURL = req.body.newLongURL;
  urlData.URL = protocolChecker(newLongURL);
  res.redirect("/urls/" + req.params.id);
});
//Add URL button redirects to URL New
app.post("/urls/", (req, res) => {
    res.redirect("/urls/new");
});
function urlsForUser (id) {
  let filteredURLS = {};
  for (var key in urlDatabase) {
    let urlData = urlDatabase[key];
    if (id === urlData.userID) {
      filteredURLS[key] = urlData;
    }
  }
  return filteredURLS;
}

//APP LISTEN//
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
