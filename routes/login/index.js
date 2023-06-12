const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// render login page
router.post("/login", (req, res) => {
  res.render("./login/login.ejs");
});
//logout
router.get("/logout", (req, res) => {
  // Clear the authentication token by setting an expired cookie
  res.clearCookie("token");

  // Redirect the user to the desired page after logging out
  res.redirect("/signup/TheBlogLounge");
});
//login as guest
router.post("/login_guest", (req, res) => {
  // Perform any necessary authentication or session handling for guest login
  // ...

  // Redirect the user to the desired page
  res.redirect("/blogpost/blogpost_data");
});
//login route
router.post("/login_user", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const user = await User.findOne({
    where: {
      name: name,
      email: email,
    },
  });

  if (!user) {
    res.status(400).send("user not found");
  }

  const compare = bcrypt.compare(password, user.password);

  if (!compare) {
    res.send("password didn't match");
  }
  console.log(process.env.SECRET);
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  //decode the token
  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log("Decoded token:", decodedToken);

  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .redirect("/user/user_data");
});

router.get("/login_user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Find the user by email and password
    const user = await User.findOne({ where: { name, email, password } });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Return the user data
    res.render("./login/login.ejs", {
      where: { email: email, password: password, name: name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
