const Profile = require('../models/Profile');

module.exports = {

  ////GET LIST OF DATA (10 lists each call)////////////////////////////////////////////////
  getCreatorsList : async(req, res, next) => {

    try {

      const allCreatorsList = await Profile.find({isCreator: true})
        .select(
          '-isCreator -__v'
        );
      
      if(!allCreatorsList) {
        return res.status(400).json({msg: 'No Creators are found'})
      }

      return res.json(allCreatorsList);

    } catch (error) {
      res.status(500).send('Server Error');
    }
  },

  
  getCreator : async(req, res, next) => {
    console.log("ID ---------",req.query.id);
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