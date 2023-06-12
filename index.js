require("dotenv").config();
const express = require("express");
const app = express();

const users = require("./routes/users");
const blogpost = require("./routes/blogposts");
const comment = require("./routes/comments");
const login = require("./routes/login");
const signup = require("./routes/signup");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const ejs = require("ejs");
const PORT = 3023;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/views/partials"));
app.use(express.static(__dirname + "/public/css"));

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/user", users);
app.use("/blogpost", blogpost);
app.use("/comments", comment);
app.use("/login", login);
app.use("/signup", signup);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
