const Series = require('../models/Series');
const Chapters = require('../models/Chapter');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {formatedNewDate} = require('../helpers/dateFormat');
const fs = require('fs');
var path = require('path');




module.exports = {



  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////GET ALL MY SERIES////////////////////////////////////////////////
  getAllMySeries: async(req, res, next) => {
    console.log("GET ALL MY SERIES");
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
    console.log("req.query.id",req.query.id)
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


  ////////////////////////////////////////////////////////////////
  ////POST MY SERIES////////////////////////////////////////////////
  postCreateSeries: async(req, res, next) => {
 
    
    const seriesDateCreated = formatedNewDate();
    const strTags = req.value.body.tags;
    const tags = strTags.split(",");
    const seriesCover = req.files.seriesCover[0].path;
    const seriesBanner = req.files.seriesBanner[0].path;
    const condition = req.value.body.condition === "true" ? true:false;
    const consent = req.value.body.consent === "true" ? true:false;

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
      
    
      series = new Series(seriesFields);

      await series.save();

      res.json(series);


    } catch (error) {
      console.log(error)
      res.status(500).send('Server Error');
    }
  },


  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////DELETE A SPECIEFIC SERIES////////////////////////////////////////////////
  deleteSeries: async(req, res, next) => {
    console.log("DELETE SERIES"); 
    console.log("QUERY ID",req.query.id); 

  //   const paths = '../uploads/series/1592228150943cover.jpg';
  
  //   fs.unlink(path.join("public/" + paths),function(err){
  //     if(err) throw err;
  //     console.log('File deleted!');
  // });
 
    try {
      await Series.findOneAndRemove({user: req.user.id,_id:req.query.id});
      await Chapters.deleteMany({user: req.user.id,seriesId:req.query.id});
   
      res.json({msg: 'series is deleted'});
    } catch (error) {
  
      res.status(500).send('Server Error');
    }
  },


}