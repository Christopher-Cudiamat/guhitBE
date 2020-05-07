const router = require('express-promise-router')();
const passport = require('passport');


//@route   GET api/series/all-my-chapters
//@desc    get all creator's chapters
//@access Private
router.get(
  '/all-my-chapters',
  passport.authenticate('jwt',{session:false}),
);


//@route   GET api/series/my-chapter
//@desc    get a creator's chapter
//@access Private
router.get(
  '/my-chapter',
  passport.authenticate('jwt',{session:false}),
);



module.exports = router;