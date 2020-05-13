const Series = require('../models/Series');
const User = require('../models/User');



module.exports = {



  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////GET ALL MY SERIES////////////////////////////////////////////////
  getAllMySeries: async(req, res, next) => {
    console.log("GET MY SERIES");
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

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////GET MY ALL SERIES////////////////////////////////////////////////
  getMySeries: async(req, res, next) => {
    console.log("GET MY SERIES");
    try {
      const series = await Series.findOne({user: req.user.id}).populate('user',['email']);

      if(!series) {
        return res.status(400).json({msg: 'There is no series created by this user'})
      }

      res.json(series);
    } catch (error) {
  
      res.status(500).send('Server Error');
    }
  },


  ////////////////////////////////////////////////////////////////
  ////POST MY SERIES////////////////////////////////////////////////
  postCreateSeries: async(req, res, next) => {
    // console.log("POST MY SERIES--------->",req.value.body);
    // console.log("IMAGE COVER------>", req.files.seriesCover[0].path);
    // console.log("USER ID--------->",req.user.id);
 
    const seriesDateCreated = new Date();
    const strTags = req.value.body.tags;
    const tags = strTags.split(",");
    const seriesCover = req.files.seriesCover[0].path;
    const seriesBanner = req.files.seriesBanner[0].path;
    const condition = req.value.body.condition === "true" ? true:false;
    const consent = req.value.body.consent === "true" ? true:false;

    const isEditSeries = true;

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
    if(tags) seriesFields.tags = tags.toString().split(',').map(tool => tool.trim());

    try {
      
    
      let series = await Series.findOne({user: req.user.id, seriesTitle: req.value.body.seriesTitle});

      if(series && isEditSeries) {
        let series = await Series.findOneAndUpdate(
          {user: req.user.id},
          {$set: seriesFields},
          {new: true}
        );

        return res.json(series);
      }
     
    
      series = new Series(seriesFields);

      await series.save();

      res.json(series);

    } catch (error) {
      console.log(error)
      res.status(500).send('Server Error');
    }
  },

}