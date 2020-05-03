const router = require('express-promise-router')();
const ProfilesController = require('../../controllers/profiles');
const {validateBody, schemas} = require('../../helpers/routeHelper');
const passport = require('passport');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './uploads/');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({storage: storage, limits:{
  // fileSize:1024*1024*5,
}});

// fileFilter = (req,file,cb) = {
//   //reject
//   if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//     cd(null,true);
//   } else {
//     cb(null,false);
//   }

// }


//@route   GET api/profiles/me
//@desc    get a user profile
//@access  Private
router.get(
  '/me',
  passport.authenticate('jwt',{session:false}),
  ProfilesController.getProfile
);


//@route   POST api/profiles/me
//@desc    update or create a user profile
//@access  Private
router.post(
  '/',
  upload.single('profilePic'),
  validateBody(schemas.profileSchema),
  passport.authenticate('jwt',{session:false}),
  ProfilesController.postProfile
);


router.post(
  '/init',
  passport.authenticate('jwt',{session:false}),
  ProfilesController.postInitProfile
);

module.exports = router;
