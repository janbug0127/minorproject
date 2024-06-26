require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const User = require("./models/register");
const auth = require("./middleware/auth");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const Formidable = require("formidable");
const multer = require("multer");
const fs = require("fs");

cloudinary.config({
  cloud_name  : process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const methodOverride = require("method-override");
const path = require("path");

var cors = require("cors");
const console = require("console");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://Anj2701:Anj%402701@sample.yo4pwee.mongodb.net/");  

var username = "tanisha";
const app = express();
app.use(cors(
  {
    origin: ["https://minorproject-rho.vercel.app"],
    methods: ["POST","GET"],
    credentials: true
  }
));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single("textfile");

const blogSchema = {
  title: String,
  content: String,
  image: String,
  userid: String,
  status: String,
  keyword: String,
  author: String,
  likescount: Number,
};
const Post = mongoose.model("Post", blogSchema);

async function uploadToCloudinary(locaFilePath) {
  const result = await cloudinary.uploader.upload(locaFilePath, {
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(locaFilePath);
  return result;
}
app.post("/submit", auth, async (req, res) => {
  upload(req, res, async (err) => {
    // console.log(req.file);
    if (err) {
      console.log("error got");
      res.send(err);
    } else {
      var locaFilePath = req.file.path;
      console.log("pathgot " + locaFilePath);
      var result = await uploadToCloudinary(locaFilePath);

      console.log(result);
      console.log("url got  " + result.url);
      const newsubmit = "newly_submit";
      const post = Post({
        title: req.body.postTitle,
        content: req.body.postBody,
        image: result.url,
        userid: req.user._id,
        status: newsubmit,
        author: req.body.authors,
        keyword: req.body.keywords,
      });

      post.save(function (err) {
        if (!err) {
          res.redirect("/storedata");
        }
      });
      console.log(post);
      console.log("post shown");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,

      content: post.content,
    });
  });
});

app.get("/home", auth, function (req, res) {
  username = req.user.name;
  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts,
      username: req.user.name,
    });
  });
});
app.get("/published", auth, function (req, res) {
  username = req.user.name;
  Post.find({}, function (err, posts) {
    res.render("published", {
      posts: posts,
      username: req.user.name,
    });
  });
});
app.get("/", function (req, res) {
  res.render("login");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/createFile", async function (req, res) {
  console.log("file created", req.body);

  const product = await Post.create(req.body);
  // res.json({ product });
  res.render("home");
});

app.post("/login", async function (req, res) {
  console.log(req.body);
  console.log(req.body.role);
  const data = User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  const token = await data.generateAuthToken();
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 60000000),
    httpOnly: true,
  });

  data.save(function (err) {
    if (!err) {
      res.render("login");
    }
  });
});

app.post("/home", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const useremail = await User.findOne({ email: email });
    var flag = bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
      secure: true,
    });
    console.log(req.cookies.jwt);
    console.log(`role entered  ${role}`);
    console.log(`original role  ${useremail.role}`);
    if (flag) {
      console.log("found");
      if (useremail.role === role) {
        if (role === "author") {
          // res.render("author",{
          //   username : useremail.name,

          // });
          res.redirect("author");
        } else if (role === "editor") {
          // res.render("editor",{
          //   posts : posts,
          //   username : useremail.name

          // });;
          res.redirect("editor");
        } else if (role === "reviewer") {
          res.redirect("reviewer");
        } else {
          res.render("reader", {
            username: useremail.name,
          });
        }
      } else {
        res.send("you are not a + ${role}");
      }
    } else {
      res.send("invalid login Details");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("invalid email");
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutcont: aboutContent });
});

app.get("/submit", auth, function (req, res) {
  res.render("submit", {
    username: req.user.name,
  });
});

app.get("/editor", auth, function (req, res) {
  Post.find({}, function (err, posts) { 

    res.render("editor", {
      posts: posts,
      username: req.user.name,
      User: User,

      //  });
    });
  });
});

app.get("/reviewer", auth, function (req, res) {
  Post.find({}, function (err, posts) {
     
    res.render("reviewer", {
      posts: posts,
      username: req.user.name,
    });
  })
});

app.get("/author", auth, function (req, res) {
  username = req.user.name;
  Post.find({}, function (err, posts) {
    res.render("author", {
      posts: posts,
      username: req.user.name,
    });
  });
});
app.get("/storedata", auth, function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("storedata", {
      authorid: req.user._id,
      posts: posts,
      username: req.user.name,
    });
  });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/register", function (req, res) {
  console.log('hii');
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/logout",auth, async function(req,res){
 try{
  res.clearCookie("jwt");
    console.log("logout sucessfully");

    await req.user.save();
    res.render("login");
 }
 catch(error){
  res.status(500).send(error);
 }
})
app.get("/contact",function(req,res){
  res.render("contact");
})

app.get("/editorpage", auth, function (req, res) {
  username = req.user.name;
  Post.find({}, function (err, posts) {
    res.render("editor", {
      posts: posts,
      username: req.user.name,
    });
  });
});
app.post("/reviewed", auth, async function (req,res){
  // let postid = req.body.postId;
  // console.log(postid);
 
  upload(req, res, async (err) => {
    // console.log(req.file);
    let postid = req.body.postId;
   
    let changestatus = req.body.status;
    if (err) {
      console.log("error got");
      res.send(err);
    } else {
      var locaFilePath = req.file.path;
      console.log("pathgot " + locaFilePath);
      var result = await uploadToCloudinary(locaFilePath);
      Post.findOne({_id: postid},function(err,reviewed_post){
        console.log(reviewed_post);
         reviewed_post.image = result.url;
         reviewed_post.status = changestatus;

         reviewed_post.save();
      })

      res.redirect("reviewer");
}  
  })
})

app.post("/statuschange",auth, async function (req, res) {
  let postid = req.body.postId;
  Post.findOne({ _id: postid}, function (err, changedpost) {
    changedpost.status = "underreview";
    changedpost.save();
  });

  Post.find({}, function (err, posts) {
    res.redirect("editor");
  });
});

app.post("/selection", auth , async function(req,res){
  let postid = req.body.postId;
  let changestatus = req.body.status;
  Post.findOne({ _id: postid}, function (err, changedpost) {
    changedpost.status = changestatus;
    changedpost.save();
  });
  res.redirect("editor");
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
