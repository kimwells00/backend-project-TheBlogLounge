# backend-project-TheBlogLounge
![Screenshot 2023-07-26 124827](https://github.com/kimwells00/backend-project-TheBlogLounge/assets/130780040/2b437fbe-faaa-47e0-89d2-4e7497a5b4b1)

##Contents
--- 

  * What it is
  * Technologies used
  * Features
  * Code examples



## What It Is
---
For my first backend project I chose to create a simple user-friendly blogging platform utilizing my full-stack web development skills in an agile fashion in one weeks' time. I used common backend tools including javascript, node.js, express, sequelize, template engines, and JSON web token. The purpose of this project was to display my skills in connecting a database to a server, and rendering the created data to the client side in a user-friendly and attractive manner. I created a database schema to visually represent the data to be created and to define their relationships as well as brainstormed essential features such as user registration, blog post creation, commenting system, and user authentication.

## Technologies used 
---
* HTML5
* CSS
* Javascript
* NodeJS
* Express
* SQL database (Elephant SQL)
* JSON web tokens (JWT)

## Features 
* Login
* Sign up
* Login as guest with restricted access
* Create a blogpost
* View a univeral feed page of all blogposts
* Leave a comment
* Logout

## Code examples 
Sign up route using Bcrypt to hash and protect passwords 
```router.post("/signup_user", async (req, res) => {
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
```


Authenticated login route using JSON web tokens
```router.post("/login_user", async (req, res) => {
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
```
Protected route to retrieve logged in users comments
```router.get("/user_comments", authenticateUser, async (req, res) => {
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
```






