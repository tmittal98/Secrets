//jshint esversion:6
// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//////////////////////////////////////////////////////////////////////////////////MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userDB',
  { useNewUrlParser: true,
    useUnifiedTopology: true
  });

const userSchema = new mongoose.Schema({
  email : String,
  password: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]  });

const User = mongoose.model('User', userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  const email = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: email,
      password: hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("secrets");
      }
    });
  });

});

app.post("/login",function(req,res){

  const email = req.body.username;
  const password = req.body.password;

    User.findOne({email : email},function(err,foundUser){
      if(err){
        console.log(err);
      }
      else{
          if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
              if(result === true){
                res.render("secrets");
              }
            });
          }
      }
    });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
