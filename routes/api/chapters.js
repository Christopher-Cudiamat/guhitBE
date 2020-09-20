const router = require('express-promise-router')();
const passport = require('passport');
const ChapterController = require('../../controllers/chapters');
const {validateBody, schemas} = require('../../helpers/routeHelper');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './uploads/chapter');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({storage: storage, limits:{
  // fileSize:1024*1024*5,
}});


//@route   GET api/series/all-my-chapters
//@desc    get all creator's chapters
//@access  Private
router.get(
  '/all-my-chapters',
  passport.authenticate('jwt',{session:false}),
  ChapterController.getAllMyChapters
);
 

// @route   GET api/series/my-chapter
// @desc    get a creator's speciefic chapter
// @access Private
router.get(
  '/my-chapter',
  passport.authenticate('jwt',{session:false}),
  ChapterController.getMyChapter
);


//@route   POST api/chapter/create-chapter
//@desc    post a creator's chapter
//@access Private
router.post(
  '/create-chapter',
  upload.fields([{
    name: 'chapterCover', maxCount: 1
  }, {
    name: 'chapterPages', maxCount: 10
  }]),
  // upload.single('chapterCover'),
  // upload.array('chapterPages', 10),
  validateBody(schemas.chapterSchema),
  passport.authenticate('jwt',{session:false}),
  ChapterController.postCreateChapter
);


//@route   DELETE api/series/delete-chapter
//@desc    DELETE a creator's chapter
//@access  Private
router.delete(
  '/delete-chapter',
  passport.authenticate('jwt',{session:false}),
  ChapterController.deleteChapter
);


// @route   GET api/series/my-chapter
// @desc    get a speciefic chapter
// @access  Public
router.get(
  '/chapter',
  ChapterController.getChapterComics
);




module.exports = router;