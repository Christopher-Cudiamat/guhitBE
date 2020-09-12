const Profile = require('../models/Profile');

module.exports = {

  ////GET LISTS OF CREATORS///////////////////////////////////////
  //get creators depending on the filter type
  getCreatorsList : async(req, res, next) => {

    const filtertype = req.query.filterType;
    const creatorName = req.query.creatorName;
    var sortParam = { };
    var findParam = {isCreator: true};


    //conditions for sorting
    if (filtertype === 'Joined') {
        sortParam = {createdAt: 'desc'}
    } else if (filtertype === 'All') {
        sortParam = {displayName: 1};
    } else if (filtertype === 'Name') {
        findParam = {isCreator: true,"displayName": { "$regex": creatorName, "$options": "i" }};
        sortParam = {displayName: 1};
    } else {
        sortParam = {likes: -1};
    }
    
    try {
      const allCreatorsList = await Profile.find(findParam)
        .skip(parseInt(req.query.skip))
        .limit(parseInt(req.query.limit))
        .sort(sortParam)
        .select(
          '-isCreator -__v'
        );
      
      const countDocuments = await Profile.find({isCreator: true});
      let dataLength = countDocuments.length;
      
      if(!allCreatorsList) {
        return res.status(400).json({msg: 'No Creators are found'})
      }

      return res.json({allCreatorsList, dataLength});

    } catch (error) {
      res.status(500).send('Server Error');
    }
  },

  //GET A SPECIEFIC CREATOR'S DATA////////////////////////////////////
  getCreator : async(req, res, next) => {
    try {
      const creator = await Profile.findOne({_id:req.query.id})
        .select(
          '-isCreator -user -__v -_id'
        );
      
      if(!creator) {
        return res.status(400).json({msg: 'No Creators are found'})
      }

      return res.json(creator);

    } catch (error) {
      res.status(500).send('Server Error');
    }
  },

  
}