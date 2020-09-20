const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  // seriesId: {
  //   type: mongoose.Schema.Types.ObjectId,
  // },
  seriesCover:{
    type: String
  },
  seriesBanner: {
    type: String
  },
  seriesTitle: {
    type: String,
  },
  seriesUrl: {
    type: String,
  },
  genrePrimary: {
    type: String,
  },
  genreSecondary: {
    type: String,
  },
  summary: {
    type: String,
  },
  tags: {
    type: [String],
  },
  consent: {
    type: Boolean,
    default: false
  },
  condition: {
    type: Boolean,
    default: false
  },
  likes:{
    type: Number, 
  },
},{
  timestamps: true
});


module.exports = Series = mongoose.model('series', SeriesSchema);