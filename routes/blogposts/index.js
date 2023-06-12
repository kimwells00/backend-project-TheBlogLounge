const express = require("express");
const router = express.Router();
const app = express();
const { blogPosts } = require("../../models");
const { User } = require("../../models");
const jwt = require("jsonwebtoken");
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

//GETS ALL BLOGPOSTS UNIVERSALLY FOR FEED PAGE
router.get("/blogpost_data", async (req, res) => {
  const post = await blogPosts.findAll();
  res.render("./blogpost/blogpost.ejs", { post: post });
});
//ROUTE TO RENDER CREATE PAGE
router.get("/blogposts_new", authenticateUser, (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // If no token is found, return an alert saying "Unauthorized"
    return res.send("<script>alert('Unauthorized');</script>");
  }

  // Verify and decode the token to get the user's information
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.id;

  res.render("./blogpost/create.ejs", { userId });
});
//ROUTE TO RENDER EDIT PAGE
router.get("/blogposts_edit", (req, res) => {
  res.render("./blogpost/edit.ejs");
});

//CREATE BLOGPOST
router.post("/create_blogpost", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;

    const token = req.cookies.token;

    if (!token) {
      // If no token is found, return an alert saying "Unauthorized"
      return res.send("<script>alert('Unauthorized');</script>");
    }

    // Verify and decode the token to get the user's information
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.id;

    // Retrieve the user with the specified userId
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new blog post associated with the user
    const blogPost = await blogPosts.create({ title, content, userId });

    res.redirect("/user/user_data");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//UPDATE A BLOG POST
router.post("/update_blogpost", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // If no token is found, return an alert saying "Unauthorized"
      return res.send("<script>alert('Unauthorized');</script>");
    }
    const { title, content, blogPostId } = req.body;

    // Check if the blog post exists
    const blogPost = await blogPosts.findByPk(blogPostId);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Update the blog post
    blogPost.title = title;
    blogPost.content = content;
    await blogPost.save();

    res.redirect("/user/user_data");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
//DELETE A BLOG POST
router.post("/delete_blogpost", authenticateUser, async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // If no token is found, return an alert saying "Unauthorized"
      return res.send("<script>alert('Unauthorized');</script>");
    }
    const { blogPostId } = req.body;

    // Check if the blog post exists
    const blogPost = await blogPosts.findByPk(blogPostId);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Delete the blog post
    await blogPosts.destroy({ where: { id: blogPostId } });

    res.redirect("/user/user_data");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
//GET BLOGPOSTS BY USERID
router.get("/user_posts", async (req, res) => {
  try {
    // Get the token from the request cookies
    const token = req.cookies.token;

    // Verify and decode the token to access the user data
    const decodedToken = jwt.verify(token, process.env.SECRET);

    // Get the user ID from the decoded token
    const userId = decodedToken.id;

    // Fetch all blog posts associated with the user ID
    const blogPosts = await blogPosts.findAll({
      where: {
        userId: userId,
      },
    });

    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
