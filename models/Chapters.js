const mongoose = require('mongoose');

const ChaptersSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  chapterCover:{
    type: String
  },
  chapterBanner: {
    type: String
  },
  chapterBanner: {
    type: String
  },
  chapterPages: {
    type: [String],
  },
  chapterUrl: {
    type: String,
  },
  chapterDateCreated: {
    type: Date,
  },
  chapterNumber: {
    type: Number,
  },
  chapterDescription: {
    type: String,
  },
  tags: {
    type: [String],
  },
  chapterLikes: {
    type: Number,
    default: 0
  },
 

});


module.exports = Chapters = mongoose.model('chapter', ChaptersSchema);