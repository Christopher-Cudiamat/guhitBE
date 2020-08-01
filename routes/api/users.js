const router = require('express-promise-router')();
const passport = require('passport');
const {validateBody, schemas} = require('../../helpers/routeHelper');
const UsersController = require('../../controllers/users');




//@route   POST api/email-verification
//@desc    Send email verification
//@access  Public
//schema: email, password
router.post(
  '/email-verification',
  validateBody(schemas.authSchema),
  UsersController.verifyEmail
);

//@route   POST api/users
//@desc    Register a user and save to data base
//@access  Public
//schema: email, password
router.post(
  '/signup',
  UsersController.signUp
);

//@route   POST api/users
//@desc    Login a user
//@access  Public
//shema: generate a token
router.post(
  '/signin',
  validateBody(schemas.authSchema),
  passport.authenticate('local',{session:false}),
  UsersController.signIn
);

//@route   POST api/users/oath/google
//@desc    Login a user via oauth google
//@access  Public
router.post(
  '/oauth/google',
  passport.authenticate('googleToken',{session:false}),
  UsersController.googleOauth,
);

//@route   POST api/users/oauth/facebook
//@desc    Login a user via oath google
//@access  Public
router.post(
  '/oauth/facebook',
  passport.authenticate('facebookToken',{session:false}),
  UsersController.facebookOauth,
);

//@route   GET api/users/secret
//@desc    authenticate a user
//@access  Public
router.get(
  '/secret',
  passport.authenticate('jwt',{session:false}),
  UsersController.secret
);


//@route   GET api/users/sendOtp
//@desc    sen a one time password
//@access  Public
router.post(
  '/send-otp',
  UsersController.sendOtp
);

module.exports = router;




































































// const express = require('express');
// const router = express.Router();
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const {check,validationResult} = require('express-validator');

// const User = require('../../models/User');  



// // @route   POST api/users
// // @desc    Register a user
// // @access  Public
// router.post('/', [
//   check('email', 'Please include a valid email')
//     .isEmail(),
//   check('password', 'Please enter a password with 6 or more character')
//   .isLength({min: 6}),
// ], async (req, res) => {

//   const errors = validationResult(req);

//   if(!errors.isEmpty()){
//     return res.status(400).json({errors: errors.array()});
//   }

//   const {email, password} = req.body;

//   try {
//     //see if user exists
//     let user = await User.findOne({email});

//     if(user) {
//       return res.status(400).json({errors: [{msg: 'User already exists'}] });
//     }

//     //get users gravatar
//     const avatar = gravatar.url(email,{
//       s: '200',
//       r: 'pg',
//       d: 'mm',
//     });

//     user = new User({
//       email,
//       avatar,
//       password,
//     });


//     // encrypt password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);
//     await user.save();


//     //Return jsonwebtoken
//     const payload = {
//       user: {
//         id: user.id,
//       }
//     }

//     jwt.sign(
//       payload, 
//       config.get('jwtSecret'),
//       {expiresIn:360000},
//       (err, token) => {
//         if(err) throw err;
//         res.json({token});
//       }
//     );

//     // res.send('User Registered');
//   } catch(err){
//     console.error(errr.message);
//     res.status(500).send('Server Error')
//   }

// });

// module.exports = router;