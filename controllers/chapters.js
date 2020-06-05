const Chapter = require('../models/Chapter');
const User = require('../models/User');
const {formatedNewDate} = require('../helpers/dateFormat');

module.exports = {


  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////GET ALL MY SERIES////////////////////////////////////////////////
  getAllMyChapters: async(req, res, next) => {
    console.log("REQUEST PARAMS", req.param.id);
    console.log("REQUEST QUERY", req.query.id);
 
    try {
      
      const chapter = await Chapter.find({user: req.user.id, seriesId:req.query.id}).populate('user',['email']);

      if(!chapter) {
        return res.status(400).json({msg: 'There is no series created by this user'})
      }

      res.json(chapter);
    } catch (error) {
  
      res.status(500).send('Server Error');
    }
  },


  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////GET ALL MY SERIES////////////////////////////////////////////////
  getMyChapter: async(req, res, next) => {
    console.log("GET A SPECIEFIC CHAPTER");
    console.log("req.query.id",req.query.id)
    try {
      const chapter = await Chapter.findOne({user: req.user.id,_id:req.query.id});

      if(!chapter) {
        return res.status(400).json({msg: 'There is no series created by this user'})
      }

      res.json(chapter);
    } catch (error) {
  
      res.status(500).send('Server Error');
    }
  },



  
  ////////////////////////////////////////////////////////////////
  ////POST MY SERIES////////////////////////////////////////////////
  postCreateChapter: async(req, res, next) => {

    const seriesId= req.value.body.seriesId;
  
    const chapterDateCreated = formatedNewDate();
    const chapterDateUpdated = formatedNewDate();
    const strTags = req.value.body.tags;
    const tags = strTags.split(",");
    const chapterCover = req.files.chapterCover[0].path;
    const chapterPages = req.files.chapterPages.map(file => file.path);
    const matureContents= req.value.body.matureContents === "true" ? true:false;
    const openForComments = req.value.body.openForComments === "true" ? true:false;

    const {
      chapterTitle,
      chapterDescription
    } = req.value.body;

    const chapterFields = {}

    chapterFields.user = req.user.id;

    if(chapterTitle) chapterFields.chapterTitle = chapterTitle;
    if(chapterCover) chapterFields.chapterCover = chapterCover;
    if(chapterPages) chapterFields.chapterPages = chapterPages;
    if(chapterDateCreated) chapterFields.chapterDateCreated = chapterDateCreated;
    // if(chapterDateUpdated && isEditChapter) chapterFields.chapterDateUpdated = chapterDateUpdated;
    if(chapterDescription) chapterFields.chapterDescription = chapterDescription;
    if(tags) chapterFields.tags = tags.toString().split(',').map(tool => tool.trim());

    chapterFields.seriesId = seriesId;
    chapterFields.matureContents = matureContents;
    chapterFields.openForComments = openForComments; 

    try {
      if(req.value.body.chapterId !== "undefined"){
        let chapter = await Chapter.findOne({user: req.user.id, _id:req.value.body.chapterId});
    
        if(chapter) {
          let chapter = await Chapter.findOneAndUpdate(
            {user: req.user.id,_id:req.value.body.chapterId},
            {$set: chapterFields},
            {new: true}
          );

          return res.json(chapter);
        }
      }

      chapter = new Chapter(chapterFields);

      await chapter.save();

      res.json(chapter);

    } catch (error) {
      console.log(error)
      res.status(500).send('Server Error');
    }
  },


}