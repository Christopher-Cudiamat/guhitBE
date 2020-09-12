const Series = require('../models/Series');
const Chapters = require('../models/Chapter');
const {formatedNewDate} = require('../helpers/dateFormat');


module.exports = {


  ////GET ALL MY SERIES////////////////////////////////////////////////
  getAllMySeries: async(req, res, next) => {
    try {
      const series = await Series.find({user: req.user.id}).populate('user',['email']);

      if(!series) {
        return res.status(400).json({msg: 'There is no series created by this user'})
      }

      res.json(series);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  },

  ////GET A SPECIEFIC CREATOR'S SERIES////////////////////////////////////////////////
  getMySeries: async(req, res, next) => {
 
    try {
      const series = await Series.findOne({user: req.user.id,_id:req.query.id});

      if(!series) {
        return res.status(400).json({msg: 'There is no series created by this user'})
      }

      res.json(series);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  },

  ////POST A CREATOR SERIES////////////////////////////////////////////////
  postCreateSeries: async(req, res, next) => {
 
    const seriesDateCreated = formatedNewDate();
    const strTags = req.value.body.tags;
    const tags = strTags.split(",");
    const seriesCover = req.files.seriesCover[0].path;
    const seriesBanner = req.files.seriesBanner[0].path;
    const condition = req.value.body.condition === "true" ? true:false;
    const consent = req.value.body.consent === "true" ? true:false;
    const likes = Math.floor(Math.random() * 1000) + 1;

    const {
      seriesTitle,
      seriesUrl, 
      genrePrimary,
      genreSecondary,
      summary
    } = req.value.body;
 
    const seriesFields = {}

    seriesFields.user = req.user.id;

    if(seriesTitle) seriesFields.seriesTitle = seriesTitle;
    if(seriesCover) seriesFields.seriesCover = seriesCover;
    if(seriesBanner) seriesFields.seriesBanner = seriesBanner;
    if(seriesDateCreated) seriesFields.seriesDateCreated = seriesDateCreated;
    if(seriesUrl) seriesFields.seriesUrl = seriesUrl;
    if(genrePrimary) seriesFields.genrePrimary = genrePrimary;
    if(genreSecondary) seriesFields.genreSecondary = genreSecondary;
    if(summary) seriesFields.summary = summary;
    seriesFields.condition = condition;
    seriesFields.consent = consent;
    if(likes) seriesFields.likes = likes;
    
    if(tags) seriesFields.tags = tags.toString().split(',').map(tool => tool.trim());

    try {
        
      if(req.value.body.isNewSeries !== "isNewSeries"){
        if(series) {
          let series = await Series.findOneAndUpdate(
            {user: req.user.id,_id: req.value.body.isNewSeries},
            {$set: seriesFields},
            {new: true}
          );
          return res.json(series);
        }
      }

      let profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$push: {seriesMade:{
          seriesTitle,
          seriesCover,
          genrePrimary,
          seriesUrl,
        }}},
        {new: true}
      );
      
      series = new Series(seriesFields);
      await series.save();
      res.json(series);

    } catch (error) {
      res.status(500).send('Server Error');
    }
  },

  ////DELETE A SPECIEFIC SERIES////////////////////////////////////////////////
  deleteSeries: async(req, res, next) => {
 
    try {
      await Series.findOneAndRemove({user: req.user.id,_id:req.query.id});
      await Chapters.deleteMany({user: req.user.id,seriesId:req.query.id});
   
      res.json({msg: 'series is deleted'});
    } catch (error) {
  
      res.status(500).send('Server Error');
    }
  },

  ////GET ALL SERIES LIST(FOR COMICS SECTION)/////////////////////////////////////
  getSeriesLists : async(req, res, next) => {
    
    const filtertype = req.query.filterType;
    const seriesTitle = req.query.seriesTitle;
    const genreType = req.query.genreType
    var findParam = {};
    var sortParam = {};

    console.log("SeriesTitle",seriesTitle)

    
    if(filtertype === "Genre"){
      findParam = {genrePrimary: genreType};
    } else if(filtertype === "New"){
      sortParam = {createdAt: 'desc'}
    } else if(filtertype === "All"){
      sortParam = {seriesTitle: 1};
    } else if (filtertype === 'Title') {
      findParam = {"seriesTitle": { "$regex": seriesTitle, "$options": "i" }};
      sortParam = {seriesTitle: 1};
    } else {
      sortParam = {likes: -1};
      findParam = {};
    }

    try {
      const seriesList = await Series.find(findParam)
        .skip(parseInt(req.query.skip))
        .limit(parseInt(req.query.limit))
        .sort(sortParam);
      
      const countDocuments = await Series.find();
      let dataLength = countDocuments.length;
      
      if(!seriesList) {
        return res.status(400).json({msg: 'No Series Found'})
      }

      return res.json({seriesList,dataLength});

    } catch (error) {
      res.status(500).send('Server Error');
    }
  },


}