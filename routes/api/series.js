const router = require('express-promise-router')();
const SeriesController = require('../../controllers/series');
const {validateBody, schemas} = require('../../helpers/routeHelper');
const passport = require('passport');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    // const dir = `./uploads/series/${req.body.seriesTitle}`
    // fs.mkdir(dir, err => cb(err, dir));
    cb(null, "./uploads/series");
  },
  filename: function(req,file,cb){
    let seriesTitle = req.body.seriesTitle.replace(/ /g, '');
    let originalName = file.originalname.replace(/ /g, '');
    console.log("NAMMMMMEEEE--", `${seriesTitle}-${originalName}`);
    cb(null,`${seriesTitle}-${originalName}`);
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


//@route   DELETE api/series/delete-series
//@desc    DELETE a creator's series
//@access  Private
router.delete(
  '/delete-series',
  passport.authenticate('jwt',{session:false}),
  SeriesController.deleteSeries
);


//@route   GET api/series/series-list
//@desc    get all comics series
//@access  Public
router.get(
  '/list',
  SeriesController.getSeriesLists
);

//@route   GET api/series/comics
//@desc    get all comics series
//@access  Public
router.get(
  '/comics',
  SeriesController.getSeriesComics
);

//@route   POST api/series/comics
//@desc    add likes
//@access  Private
router.post(
  '/like',
  passport.authenticate('jwt',{session:false}),
  SeriesController.postUpdateLike
);



module.exports = router;