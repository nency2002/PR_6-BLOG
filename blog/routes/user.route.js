const {Router} = require("express")
const user = require("../models/user.schema")
const router =Router()

// get 
router.get("/signup", (req, res) => {
  res.render("signup")
})
// post
router.post("/signup", async (req, res) => {
  let data = await user.findOne({ email: req.body.email });
  if (!data) {
    data = await user.create(req.body);
  }
  res.cookie("role", data.role); 
  res.cookie("id", data.id, { maxAge: 50000 }); 
  res.send(`Account created successfully ${data.username}`);

})

// get

router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let data = await user.findOne({ email: email, password: password });
  if (data) {
    res.cookie("id", data.id); 
    res.cookie("role", data.role);
    res.send(`Welcome User ${data.username}`);
  } else {
    res.send("Invalid Credentials.");
  }
});

router.delete("/delete/:id", async (req, res) => {
  let data = await user.findByIdAndDelete(req.params.id);
  res.send(`User deleted ${data.username}`);
});

// user


module.exports =router