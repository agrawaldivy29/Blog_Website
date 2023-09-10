const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const app = express();

const homeStartContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.set('strictQuery', false);
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/blogPostDB', { useNewUrlParser: true, useUnifiedTopology: true });
}

const postSchema = {
  title: String,
  body: String,
};

const Post = mongoose.model("Post", postSchema);

let pageTitleApp = "";

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  pageTitleApp = "Home";

  Post.find({}, (err, foundPost) => {
    if (err) console.log(err);
    else 
    {
      res.render("home", {
        pageTitle: pageTitleApp,
        startContent: homeStartContent,
        postsArray: foundPost
      });
    }
  })
  
})

app.get("/about", (req, res) => {
  pageTitleApp = "About";
  res.render("about", { 
    startContent: aboutContent, 
    pageTitle: pageTitleApp 
  });
})

app.get("/contact", (req, res) => {
  pageTitleApp = "Contact Us"
  res.render("contact", { 
    startContent: contactContent, 
    pageTitle: pageTitleApp 
  });
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {

  const Title = req.body.composeTitle;
  const Body = req.body.composeBody;

  const newPost = new Post({
    title: Title,
    body: Body
  });
  newPost.save((err) => {
    if (err) console.log(err);
    else res.redirect("/");
  });
})

app.get("/posts/:textUrl", (req, res) => {
  
  const id = req.params.textUrl;

  Post.findById(id, (err, foundPost) => {
    res.render("post", {
      title: foundPost.title,
      body: foundPost.body
    })
  })
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
