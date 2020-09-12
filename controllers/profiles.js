
const Profile = require('../models/Profile');
const User = require('../models/User');
const Series = require('../models/Series');
const gravatar = require('gravatar');

const {formatedNewDate} = require('../helpers/dateFormat');

module.exports = {

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////GET PROFILE////////////////////////////////////////////////
  getProfile: async(req, res, next) => {
    console.log("req.user.id",req.user.id)
    try {
      const profile = await Profile.findOne({user: req.user.id}).populate('user',['email']);

      if(!profile) {
        return res.status(400).json({msg: 'There is no profile for this user'})
      }

      res.json(profile);
    } catch (error) {
  
      res.status(500).send('Server Error');
    }
  },


  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////POST CREATE PROFILE AFTER SIGN UP////////////////////////////////////////////////
  postInitProfile: async(req, res, next) => {
    console.log("REQ_______",req.body);
    console.log("RES_______",res);
    const avatar = gravatar.url(req.email,{
      s: '200',
      r: 'pg',
      d: 'mm',
    });
    
    const {displayName} = req.body;
    const user = req.user.id;
    const profilePic = avatar;
    const profileFields = {};
    profileFields.user = user;

    if(displayName) profileFields.displayName = displayName;
    if(profilePic) profileFields.profilePic = profilePic;

    try {

      //CREATE ONE IF NO EXISTING PROFILE
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);

    } catch (error) {
      res.status(500).send('Server Error')
    }
  },


  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////POST CREATE PROFILE FOR PUBLISHERS OR CREATOR///////////////
  postProfile: async(req, res, next) => {
    const isCreator = true
    const profilePic = req.file.path;
    const strTools = req.value.body.tools;
    const tools = strTools.split(",");
    const likes = Math.floor(Math.random() * 1000) + 1;

    const {
      displayName,
      city,
      description,
      patreon,

    } = req.value.body;

    //Buidle profileFields
    const profileFields = {};

    profileFields.user = req.user.id;
    profileFields.seriesMade = [];
    //SOLVE THIS
    

    if(profilePic) profileFields.profilePic = profilePic;
    if(displayName) profileFields.displayName = displayName;
    if(city) profileFields.city = city;
    if(description) profileFields.description = description;
    if(isCreator) profileFields.isCreator = isCreator;
    if(patreon) profileFields.patreon = patreon;
    
    //This is for testing only to be changed with real values later..
    if(likes) profileFields.likes = likes;
    if(tools) {
      profileFields.tools = tools.toString().split(',').map(tool => tool.trim());
    }
  

    try {

      //LOOK FOR ONE
      let profile = await Profile.findOne({user: req.user.id});
      
      //UPDATE IF FOUND ONE
      if(profile) {
        let profile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        );

        return res.json(profile);
      }

      //CREATE ONE IF NO EXISTING PROFILE
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);

    } catch (error) {
      console.log(error)
      res.status(500).send('Server Error')
    }
  }



}