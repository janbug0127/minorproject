//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 mongoose.connect("mongodb://localhost:27017/blogdb",{useNewUrlParser : true , useUnifiedTopology : true})
 // .then(()=> console.log("connection successfull ....."))
 //  .catch((err)=> console.log(err));
// mongoose.connect("mongodb://localhost:27017/logindb",{useNewUrlParser : true , useUnifiedTopology : true})
const homeStartingContent = "Write your thoughts regarding recents development and trends in IT sector and let the community grow";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema = {
  title : String,
  content:String
 };

 
 const Post = mongoose.model("Post", blogSchema);
 const userdetailSchema = new mongoose.Schema( {
    name:{
      type : String,
      required : true
    },
    email:{
      type: String,
      required:true
    },
    password:{
      type:String,
      required : true

    },
    tokens:[{
      token:{
        type: String,
        required : true
      }
    }
    ]
 });

  userdetailSchema.methods.generateAuthToken = async function(){
    try {
         console.log(this._id);
         const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
         this.tokens = this.tokens.concat({token : token})
         await this.save();
         return token
    }
      catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);
      }
  } 

 
 userdetailSchema.pre("save", async function(next){
  if(this.isModified("password")){
     this.password = await bcrypt.hash(this.password , 10);
    
  }
 })
 const User = new  mongoose.model("User", userdetailSchema);
 app.get("/home",function(req, res){
  Post.find({}, function(err, posts){

   res.render("home", {
  
    startingContent: homeStartingContent,
  
    posts: posts
                              
      });
  
   })
 
 })
app.get("/", function(req,res){
  res.render("login",); 
})
app.post("/login", async function(req,res){
  console.log(req.body); 
  const data = User( {
    name : req.body.name,
    email : req.body.email,
    password : req.body.password
  });

const token = await data.generateAuthToken();

 
data.save(function(err){
if (!err){
  res.render("login");
}});
  
 // res.render("login",);
 });


app.post("/home",  async function(req,res){
   try{
   const  email = req.body.email;
    const password = req.body.password;
    // console.log(password);
      const useremail = await User.findOne({email : email});
      var flag = bcrypt.compare(password, useremail.password);
      const token = await useremail.generateAuthToken();
      // console.log(flag);
      if(flag){
        console.log("found");
        res.status(201).redirect("/home");
      }
     else{
      res.send("invalid login Details");
     }
      }
   catch(error){
    console.log(error);
    res.status(400).send("invalid email");
   }
})


app.get("/about", function(req, res){
  res.render("about", {aboutcont : aboutContent});
})
app.get("/contact",function(req,res){
   res.render("contact",{contactcont : contactContent});
})

app.get("/compose",function(req,res){
  res.render("compose",);
})
app.post("/compose",function(req, res){
  console.log(req.body);
  const post = Post( {
     title : req.body.postTitle,
     content : req.body.postBody
   });
  
   post.save(function(err){
   if (!err){
 res.redirect("/home");
 }
  });
   console.log(post);
   });
app.get("/posts/:postId", function(req,res){
  const requestedPostId = req.params.postId;
   Post.findOne({_id: requestedPostId}, function(err, post){ 
    res.render("post", {

      title: post.title,
 
      content: post.content
 
    });
   });
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});


