const express = require("express");
const { users } = require("./model/index");
const app = express();
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");

// database connection
require("./model/index");

// form bata ako data parse gar.., parse incoming form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/register", (req, res) => {
  res.render("register");
});

// post api for handling user registration.
app.post("/register", async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  // aako ko email ko kohi xa ki nae find garnu paryo

  const emailExist = await users.findAll({
    where: {
      email: email,
    },
  });
  if (emailExist.length > 0) {
    res.send("User with that email already registered");
  } else {
    if (!email || !username || !password) {
      return res.send("Please provide email, username, password");
    }

    // let's store datas on databse...
    await users.create({
      email: email,
      username: username,
      password: bcrypt.hashSync(password, 8),
    });

    res.redirect("/login");
  }
});

// Login...
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1st - tyo registered vayeko email ko kohi hamro users table ma xa ki xaina
  const userExists = await users.findAll({
    where: {
      email: email,
    },
  });

  if (userExists.length > 0) {
    // 2nd -> password check garnu paryo
    const isMatch = bcrypt.compareSync(password, userExists[0].password);
    if (isMatch) {
      res.send("Logged in Successfully");
    } else {
      res.send("Invalid Email or Password");
    }
  } else {
    //
    res.send("Invalid Email Or Password");
  }
});

app.listen("3000", function () {
  console.log("NodeJs project has started at port 3000");
});
