const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
 
  profilePic: {
    type: String,
  },
  displayName: {
    type: String,
  },
  city: {
    type: String,
  },
  description: {
    type: String,
  },
  joinedDate:{
    type: String, 
  },
  isCreator:{
    type: Boolean,
    default: false
  },
  patreon:{
    type: String
  },
  tools: {
    type: [String]
  },
  isCreator:{
    type: Boolean,
    default:false
  },
  seriesMade:{
    type: [String]
  }
  


});


module.exports = Profile = mongoose.model('profile', ProfileSchema);