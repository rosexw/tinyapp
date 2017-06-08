var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
var randomPass = require("./random.js");
var protocolChecker = require("./protocolChecker.js");
var PORT = process.env.PORT || 8080;

//fix design of everything at the end, once everything is working

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("<html><body><h1>Welcome to TinyApp: a URL Shortener Tool!</h1></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});
//redirect shortURL to long URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.end('<html><body>URL not found</body></html>\n');
  }
});

// //login
// app.post("/login", (req, res) => {
//   //if correct, enter into login page - own urls
//   //if incorrect, then register or show error, incorrect login
//     res.redirect("/urls/");
// });

//creates random shortURL
app.post("/urls", (req, res) => {
  // console.log(req.body);
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
