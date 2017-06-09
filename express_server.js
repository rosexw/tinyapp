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

//set global variables/objects
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//APP GET//
//home page - put header here as well
app.get("/", (req, res) => {
  res.end("<html><body><h1>Welcome to TinyApp: a URL Shortener Tool!</h1></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
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
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});
//redirect shortURL to long URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
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
        return res.redirect("/");
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
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
});
//Edit button/update
app.post("/urls/:id/update", (req, res) => {
  var newLongURL = req.body.newLongURL;
  // console.log(newLongURL);
  urlDatabase[req.params.id] = protocolChecker(newLongURL);
  res.redirect("/urls/" + req.params.id);
});
// Stats button
app.post("/urls/:id/stats", (req, res) => {
    res.redirect("/urls/" + req.params.id);
});
//Add URL button redirects to URL New
app.post("/urls/", (req, res) => {
    res.redirect("/urls/new");
});
//Show Long URL
app.post("/urls/:id", (req, res) => {
    urlDatabase[req.params.id];
});

//APP LISTEN//
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
