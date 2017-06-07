var express = require("express");
var app = express();
var randomPass = require("./random.js");
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Welcome!");
});

  app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/hello", (req, res) => {
    res.end("<html><body>Hello <b>World</b></body></html>\n");
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
  app.post("/urls", (req, res) => {
    console.log(req.body);
    var shortURL = randomPass();
    res.redirect("/urls/" + shortURL);
    // console.log(shortURL);
  });
  app.get("/urls/:id", (req, res) => {
    let templateVars = { header: req.params.id };
    res.render("_header", templateVars);
  });

  app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    if (longURL) {
      res.redirect(longURL);
    } else {
      res.end("<html><body>URL not found</body></html>\n");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});
