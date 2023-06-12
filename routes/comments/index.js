const express = require("express");
const router = express.Router();
const { comments } = require("../../models");
const { User } = require("../../models");
const { blogPosts } = require("../../models");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const PORT = 3023;
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // If no token is provided, user is treated as guest
    req.user = null;
    next();
  } else {
    try {
      // Verify and decode the token to access the user data
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const userId = decodedToken.id;

      // Fetch the authenticated user
      const user = User.findByPk(userId);

      if (!user) {
        // If user not found, treat as guest
        req.user = null;
      } else {
        // Set the authenticated user in the request
        req.user = user;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid token" });
    }
  }
};
//ROUTE TO RENDER COMMENT PAGE
router.get("/comments_page", (req, res) => {
  res.render("./comments/comments.ejs");
});

//CREATE NEW COMMENT
router.post("/create_new_comment", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      // If no token is found, return an alert saying "Unauthorized"
      return res.send("<script>alert('Unauthorized');</script>");
    }
    const { userId, blogPostId, content } = req.body;

    // Create the comment
    const comment = await comments.create({
      userId,
      blogPostId,
      content,
    });

    res.redirect("/blogpost/blogpost_data");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
//GET ALL COMMENTS
router.get("/get_all_comments", async (req, res) => {
  const comment = await comments.findAll();
  res.send(comment);
});
//GET USERS COMMENTS
router.get("/user_comments", authenticateUser, async (req, res) => {
  try {
    // Get the token from the request cookies
    const token = req.cookies.token;
    if (!token) {
      // If no token is found, return an alert saying "Unauthorized"
      return res.send("<script>alert('Unauthorized');</script>");
    }

    // Verify and decode the token to access the user data
    const decodedToken = jwt.verify(token, process.env.SECRET);

    // Get the user ID from the decoded token
    const userId = decodedToken.id;

    // Fetch all comments associated with the user's blog posts
    const userComments = await comments.findAll({
      include: [
        {
          model: blogPosts,
          where: { userId: userId },
        },
        {
          model: User,
        },
      ],
    });

    res.render("./comments/comments.ejs", {
      userComments: userComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
