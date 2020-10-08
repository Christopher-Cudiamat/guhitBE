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
  likes:{
    type: [Object], 
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
  seriesMade:{
    type: [Object]
  },
},{
  timestamps: true
});


module.exports = Profile = mongoose.model('profile', ProfileSchema);