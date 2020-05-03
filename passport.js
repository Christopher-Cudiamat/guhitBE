const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const config = require('config');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/User');


//JSON WEBTOKEN STRATEGY
passport.use('jwt',new jwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.get('jwtSecret'),
}, async(payload,done) => {
  try {
    //find the user specified in token
    const user = await User.findById(payload.sub).select('-local.password');

    //if doesnt exist
    if(!user) {
      return done(null, false);
    }

    //otherwise return user
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));


//GOOGLE OATH STRATEGY
passport.use('googleToken',new GooglePlusTokenStrategy({

  clientID: '37421698326-su5uk9dg2842l636g5s9ugvajtbh0k3o.apps.googleusercontent.com',
  clentSecret: 'XAe1lEzY98i4Q3MYoEz3MlLz'
},async(accessToken,refreshToken,profile,done) => {
  try {
    //check if user exist in db
    
    const existingUser = await User.findOne({'google.id': profile.id});
    if(existingUser) {
      console.log("User already exist in DB");
      return done(null,existingUser)
    }

    console.log("User doesn exist, save in DB");
    //if new account
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();
    done(null,newUser);
    
  } catch (error) {
    done(error,false,error.message)
  }

  
}));


//FACEBOOK STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: '2504905576489719',
  clentSecret: '326580f37a3344ac4eb311de6856fd75'
}, async(accessToken,refreshToken,profile,done) => {
  try {
    console.log("at",accessToken);
    console.log("rt",refreshToken);
    console.log("p",profile);
  } catch (error) {
    done(error,false,error.message);
  }
}));


//LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email,password, done) => {
  try {
     
    //find the user given the email
    const user = await User.findOne({"local.email": email});
    console.log(user);
    //if not, handle it
    if (!user) {
      console.log("NO USER EMAIL");
      return done(null,false, { message: 'bad password' });
    }
    //check if th4e pass is correct
    const isMatch = await user.isValidPassword(password);
 
    if (!isMatch){
      console.log("NO USER PASSWPRD");
      return done(null,false,{ message: 'bad password' });
    } 
 

    done(null,user);
  } catch (error) {
    console.log("ERRROOOORRRR",error)
    done(error,false,{ message: 'bad password' });
  }
  
}));