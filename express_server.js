const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const randomPass = require("./random.js");
const protocolChecker = require("./protocolChecker.js");
const PORT = process.env.PORT || 8080;
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require("body-parser");

//stretch - method override - not doing that at this moment

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));
app.set("view engine", "ejs");

let urlDatabase = {
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

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("test1")
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("test2")
  }
}

//APP GET//
//this is a welcome page, where users can choose to login or register.
//But I noticed in the requirements, that it needs to have an if statement.
//If the user is on the / page and is not logged in, then they should log in, redirect to login.
//and if they are logged in, they should go to the urls page.
//however, I disagree with this, and think that the / should be the welcome page.
//that way, if the user doesn't have an account, they need to register first, not login!
app.get("/", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("home", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let userID = req.session.user_id;
  let templateVars = {
    urls: urlsForUser(userID),
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register");
});

app.get("/login", (req, res) => {
  let templateVars = {
      user: users[req.session.user_id]
    }
  if (templateVars.user) {
      res.redirect("/urls");
    } else {
      res.render("login");
    }
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  let urlData = urlDatabase[req.params.id];
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlData.URL,
    user: users[req.session.user_id],
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

//stretch - keep track of how many times a given short URL is visited
//and display it on the edit page for the URL
//plan is to make a counter

//APP POST//
app.post("/login", (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.status(400).send("Please enter email and/or password.");
    }
    for (let key in users) {
      if (email === users[key].email && bcrypt.compareSync(password, users[key].password)) {
        req.session.user_id = key;
        return res.redirect("/urls");
      }
    }
    res.status(403).send("Incorrect email and/or password.");
})

app.post("/logout", (req, res) => {
    req.session.user_id = null;
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
    for (let key in users) {
      if (email === users[key].email) {
        return res.status(400).send("User already exists!");
      }
    }
    users[user_id] = {
      id: user_id,
      email: email,
      password: bcrypt.hashSync(password)
    };
    req.session.user_id = user_id;
    res.redirect("/urls");
});
//creates random shortURL
app.post("/urls", (req, res) => {
  let shortURL = randomPass();
  res.redirect("/urls/" + shortURL);
});

//Delete button
app.post("/urls/:id/delete", (req, res) => {
  let urlData = urlDatabase[req.params.id];
  if (req.session.user_id !== urlData.userID) {
    return res.status(403).send("Unauthorized to delete this URL.");
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
//Edit button/update
app.post("/urls/:id/update", (req, res) => {
  let urlData = urlDatabase[req.params.id];
  if (req.session.user_id !== urlData.userID) {
    return res.status(403).send("Unauthorized to edit this URL.");
  }
  let newLongURL = req.body.newLongURL;
  urlData.URL = protocolChecker(newLongURL);
  res.redirect("/urls/" + req.params.id);
});
//Add URL button redirects to URL New
app.post("/urls/new", (req, res) => {
  let shortURL = randomPass();
  urlDatabase[shortURL] = {
    URL: protocolChecker(req.body.longURL),
    userID: req.session.user_id
  }
  res.redirect("/urls");
});

function urlsForUser (id) {
  let filteredURLS = {};
  for (let key in urlDatabase) {
    let urlData = urlDatabase[key];
    if (id === urlData.userID) {
      filteredURLS[key] = urlData;
    }
  }
  return filteredURLS;
}

app.post("/urls/new", (req, res) => {
  res.render("urls_new");
});

//APP LISTEN//
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
