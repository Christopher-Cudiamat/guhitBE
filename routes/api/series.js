const router = require('express-promise-router')();
const SeriesController = require('../../controllers/series');
const {validateBody, schemas} = require('../../helpers/routeHelper');
const passport = require('passport');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './uploads/series');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({storage: storage, limits:{
  // fileSize:1024*1024*5,
}});



//@route   GET api/series/all-my-series
//@desc    get all creator's series
//@access Private
router.get(
  '/all-my-series',
  passport.authenticate('jwt',{session:false}),
  SeriesController.getAllMySeries
);


//@route   GET api/series/my-series
//@desc    get a creator's series
//@access Private
router.get(
  '/my-series',
  passport.authenticate('jwt',{session:false}),
  SeriesController.getMySeries
);



//@route   POST api/series/my-series
//@desc    post a creator's series
//@access  Private
router.post(
  '/create-series',
  upload.fields([{
    name: 'seriesCover', maxCount: 1
  }, {
    name: 'seriesBanner', maxCount: 1
  }]),
  validateBody(schemas.seriesSchema),
  passport.authenticate('jwt',{session:false}),
  SeriesController.postCreateSeries
);


//@route   POST api/series/delete-series
//@desc    post a creator's series
//@access  Private
router.delete(
  '/delete-series',
  passport.authenticate('jwt',{session:false}),
  SeriesController.deleteSeries
);


module.exports = router;