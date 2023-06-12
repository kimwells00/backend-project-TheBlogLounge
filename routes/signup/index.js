const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const bcrypt = require("bcrypt");

router.get("/TheBlogLounge", (req, res) => {
  res.render("./signup/signup.ejs");
});

router.post("/signup_user", async (req, res) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  // Create the user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  if (user.error) {
    res.status(400).send("error creating the user");
    return;
  }

  res.redirect("/login/login");
});

module.exports = router;
