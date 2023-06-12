const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { blogPosts } = require("../../models");
const jwt = require("jsonwebtoken");

const PORT = 3023;
// Middleware for authenticating users
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

//GET USERS BLOG POSTS
router.get("/user_data", authenticateUser, async (req, res) => {
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

  // Fetch all blog posts associated with the user ID
  const userBlogPosts = await blogPosts.findAll({
    where: {
      userId: userId,
    },
  });

  res.render("./user/user.ejs", {
    userBlogPosts: userBlogPosts,
  });
});
router.delete("/delete_user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
