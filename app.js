require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const encrypt=require("mongoose-encryption");
const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});



userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedfields:['password']});

const User=mongoose.model("User",userSchema);

app.use(express.static("public"));
app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  const newuser=new User({
    email:req.body.username,
    password:req.body.password
  });
  async function Save(){
    try {
      await newuser.save();
      res.render("secrets");
    } catch (e) {
      res.send(e);
    }
  };
  Save();
})

app.post("/login",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;

  async function findData(){
    try {
      const data=await User.findOne({email:username});
      if (data.email===username && data.password===password) {
        res.render("secrets");
      }
    } catch (e) {
      console.log(e);
    }
  };
  findData();
})


app.listen(3000,()=>{
  console.log("Server is running on port 3000");
});
