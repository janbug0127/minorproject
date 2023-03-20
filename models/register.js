const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
   });

 const User = new  mongoose.model("User", userdetailSchema);
 module.exports = User;