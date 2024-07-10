
const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", async (req, res) => {
  try{
    const userExists = await User.findOne({email:req.body.email});
    if(userExists){
      res.send({
        success:false,
        message:"user allready exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(req.body.password,salt);
    req.body.password = hashedPassword;
    
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);

  }catch(error){
    res.json(error);
  }

});

router.post("/login", async (req, res) => {
  const user = await User.findOne({email:req.body.email});
  if(!user){
    res.send({
      sucess:false,
      message:"User not Found ( ; _ ; ). Please Register"
    })
  }
  const validPassword = await bcrypt.compare(req.body.password,user.password);
  if(!validPassword){
    return res.send({
      sucess:false,
      message:"invalid password Found ( ; _ ; )"
    });
  }
  res.send({
    sucess:true,
    message:"User Loged in"
  });
});


module.exports = router;