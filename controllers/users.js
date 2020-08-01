const JWT = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const gravatar = require('gravatar');

const mailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require('path');

viewPath = path.resolve("views/emails"); 

const signToken = (user) => {
  return JWT.sign({
    iss: 'Guhit',
    data: user,
    sub: user.id,
    iat: new Date().getTime(),//current time 
    exp: new Date().setDate(new Date().getDate() + 1)//current time + 1day ahead
  },config.get('jwtSecret'));
};

module.exports = {

  verifyEmail: async(req, res, next) => {

    const {email, password}  = req.value.body;

    let code =  Math.floor(Math.random() * 100000) + 1;

    const foundUser = await User.findOne({"local.email":email});

    if(foundUser) {
      return res.status(400).json({error: 'Email is already in use'});
    }

    const avatar = gravatar.url(email,{
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const token = signToken({email,password,avatar,code});

    const transporter = mailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth:{
          user: config.get('mailer'),
          pass: config.get('password')
      },
    });

    transporter.use('compile', hbs({
      viewEngine: {
          extName: '.handlebars',
          partialsDir: viewPath,
          layoutsDir: viewPath,
          defaultLayout: false,
          },
          viewPath:  viewPath,
          extName: '.handlebars',

    }));

    let body =  {
      from: "www.guhit.com",
      to: email,
      subject: 'Guhit account activation',
      template: 'emailverification',
      context: {
        verifyCode : code,
      }
    }

    transporter.sendMail(body,(err,result) => {
      if(err){
        return false;
      }
      return res.json({
        token,
        message: 'Hi! we sent you an e-mail, kindly check your inbox to activate the account'
      });
    });
  },


  signUp: async(req, res, next) => {
   
    const {token,verificationCode}  = req.body;

    if(token) {
      JWT.verify(token,config.get('jwtSecret'),(err,decodedToken) => {

        if(err){
          return res.status(400).json({error:'Incorrect or Expired link.'});
        }
        
        const {email,password,avatar,code} = decodedToken.data;

        if(verificationCode !== code.toString()){
          return res.status(400).json({error:'Invalid verification code.'});
        }

        const newUser = new User({
          method: "local",
          local:{email,password,avatar}
        }); 

        newUser.save();

        const newToken = signToken(newUser);

        console.log(newToken)

        res.status(200).json({newToken,email});

      });
    }
   
  },

  googleOauth: async(req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({token});
  },

  facebookOauth: async(req, res, next) => {
    console.log('LOGIN WITH FACEBOOK SUCCESS');
  },

  signIn: async(req, res, next) => {
    console.log('LOGIN req',req);
    console.log('LOGIN res',res);
    const token = signToken(req.user);
    res.status(200).json({token});
  },

  secret: async(req, res, next) => {
    console.log('I MANAGED TO GET HERE',req.user);
    const user = req.user
    res.json({user});
  },

  sendOtp: async(req, res, next) => {
    
    const {email}  = req.body;
    console.log(email)

    let code =  Math.floor(Math.random() * 100000) + 1;

    const foundUser = await User.findOne({"local.email":email});

    if(!foundUser) {
      return res.status(400).json({error: 'User does not exist'});
    }


    const transporter = mailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth:{
          user: config.get('mailer'),
          pass: config.get('password')
      },
    });

    transporter.use('compile', hbs({
      viewEngine: {
          extName: '.handlebars',
          partialsDir: viewPath,
          layoutsDir: viewPath,
          defaultLayout: false,
          },
          viewPath:  viewPath,
          extName: '.handlebars',

    }));

    let body =  {
      from: "www.guhit.com",
      to: email,
      subject: 'Guhit change password',
      template: 'changepassword',
      context: {
        verifyCode : code,
      }
    }

    transporter.sendMail(body,(err,result) => {
      if(err){
        return false;
      }
      return res.json({
        message: 'Hi! we sent you an OTP'
      });
    });
}

}
