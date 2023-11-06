const {Router} = require("express");
const user = require("../models/user.schema");
const Fuse = require("fuse.js");
const blogdata = require("../models/blog.schema");
const { isAuth, validation, islogin, } = require("../middlewares/auth");

const blog = Router();

blog.get("/create", isAuth ,(req, res) => {
  res.render("post");
})

blog.post("/create", isAuth,validation , async (req, res) => {
  let datas = await user.findById(req.cookies.id);
  let { title, content, image, category } = req.body;
  let data = await blogdata.create({
    title,content,image,category,author: datas.username,
  });
  res.cookie("blogId", data.id).send(`blog created by ${datas.username} `);
});

blog.get("/blogs", async (req, res) => {
  let { category } = req.query;
  if (category) {
    data = await blogdata.find({ category: category });
  } else {
    data = await blogdata.find();
  }
  res.send(data);
});

blog.get("/", (req, res) => {
  res.render("blog");
});

blog.delete("/delete", async (req, res) => {
  let data = await blogdata.deleteMany({ title: "checking" });
  res.send(data);
});

blog.delete("/delete/:id", isAuth, async (req, res) => {
  let { id } = req.params;
  let data = await blogdata.findByIdAndDelete(id);
  try {
    if (data) res.redirect("/blog");
    else {
      res.send("no found");
    }
  } catch (error) {
    res.send("testing");
  }
});

blog.patch("/edit/:id", isAuth, async (req, res) => {
  let { id } = req.params;
  let data = await blogdata.findByIdAndUpdate(id, req.body);
  try {
    if (data) res.send("updated");
    else {
      res.send("not found");
    }
  } catch (error) {
    res.send("testing");
  }
});

blog.get("/singleBlog/:id", async (req, res) => {
  let { id } = req.params;
  let singleBlog = await blogdata.findById(id);
  res.render("singleblog", { singleBlog });
});

blog.patch("/like/:mid", islogin, async (req, res) => {
  let { id } = req.cookies;
  let { mid } = req.params;
  let username = await user.findById(id);
  let post = await blogdata.findById(mid);
  post.likedBy.push({ username: username.username });
  await post.save();
  res.send(post);
});

blog.patch("/comment/:mid", islogin, async (req, res) => {
  let { id } = req.cookies;
  let { mid } = req.params;
  let User = await user.findById(id);
  let post = await blogdata.findById(mid);
  post.comments.push({ username: User.username, text: req.body.text });
  await post.save();
  res.send(post);
});

blog.get("/search", async (req, res) => {
  let query = req.query.blogs;
  const blogs = await blogdata.find();
  const options = {
    keys: ["author", "category", "title"],
  };
  const fuse = new Fuse(blogs, options);
  const result = fuse.search(query);
  res.send(result);
});


blog.get("/", (req, res) => {
  res.render("blog");
});














module.exports = blog
