const JWT = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const gravatar = require('gravatar');


const signToken = (user) => {
  return JWT.sign({
    iss: 'Guhit',
    sub: user.id,
    iat: new Date().getTime(),//current time 
    exp: new Date().setDate(new Date().getDate() + 1)//current time + 1day ahead
  },config.get('jwtSecret'));
};

module.exports = {
  signUp: async(req, res, next) => {
    console.log('SIGNUP CALLED');
    const {email, password}  = req.value.body;

    //Check if email exists already
    const foundUser = await User.findOne({"local.email":email});
    if(foundUser) {return res.status(403).json({error: 'Email is already in use'});}
    
    //get users gravatar
    const avatar = gravatar.url(email,{
      s: '200',
      r: 'pg',
      d: 'mm',
    });
 
    //Create new user
    const newUser = new User({
      method: "local",
      local:{
        email: email,
        password: password,
        avatar: avatar
      }
    }); 
    await newUser.save();

    //Generate token
    const token = signToken(newUser);

    //Respond with token
    res.status(200).json({token});
   
  },

  googleOauth: async(req, res, next) => {
    console.log('LOGIN WITH GOOGLE SUCCESS');
    console.log("REEEEEEEEQQQUUUUESSSTTT",req);
    const token = signToken(req.user);
    res.status(200).json({token});
  },

  facebookOauth: async(req, res, next) => {
    console.log('LOGIN WITH FACEBOOK SUCCESS');
    // console.log(req.user);
    // const token = signToken(req.user);
    // res.status(200).json({token});
  },

  signIn: async(req, res, next) => {
    console.log('LOGIN req',req);
    console.log('LOGIN res'),res;
    const token = signToken(req.user);
    res.status(200).json({token});
  },

  secret: async(req, res, next) => {
    console.log('I MANAGED TO GET HERE',req.user);
    const user = req.user
    res.json({user});
  }
}