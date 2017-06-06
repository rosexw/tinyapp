var express = require("express");
var app = express();
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
    res.render("urls_new");
  });
  app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL: req.params.id };
    res.render("urls_show", templateVars);
  });
  app.post("/urls", (req, res) => {
    console.log(req.body);  // debug statement to see POST parameters
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });
  app.get("/urls/:id", (req, res) => {
    let templateVars = { header: req.params.id };
    res.render("_header", templateVars);
  });
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});

// function generateRandomString() {
//   var
// }
