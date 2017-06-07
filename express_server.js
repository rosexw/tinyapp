var express = require("express");
var app = express();
var randomPass = require("./random.js");
var protocolChecker = require("./protocolChecker.js");
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//find URL
function findURL(id) {
  let foundURL;
  urlDatabase.forEach((url) => {
    if (url.id == id) {
      foundURL = url;
    }
  });
  return foundURL;
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
  // console.log("/urls/new");
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
    res.end("<html><body>URL not found</body></html>\n");
  }
});
//creates random shortURL
app.post("/urls", (req, res) => {
  console.log(req.body);
  var shortURL = randomPass();
  res.redirect("/urls/" + shortURL);
});

//Delete URL
app.post('/urls/:id/delete', (req, res) => {
    // find url in database
    const u = findURL(req.params.id);
    // if does not exist return a 404
    if (!u) {
      res.status(404).send('URL not found.');
      return;
    }
    // remove URL from database
    const index = urlDatabase.indexOf(u);
    urlDatabase.splice(index, 1);
    // redirect to home
    res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
