const mongoose = require('mongoose');

const ChaptersSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  seriesId:{
    type: String
  },
  chapterCover:{
    type: String
  },
  chapterPages: {
    type: [String],
  },
  chapterTitle: {
    type: String,
  },
  chapterNumber: {
    type: Number,
    default: 1
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
  matureContents: {
    type: Boolean,
    default: false
  },
  openForComments: {
    type: Boolean,
    default: false
  },
},{
  timestamps: true
});


module.exports = Chapter = mongoose.model('chapter', ChaptersSchema);