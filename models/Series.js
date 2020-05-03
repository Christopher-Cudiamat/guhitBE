const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
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
  seriesDateCreated: {
    type: Date,
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
  // seriesLikes: {
  //   type: Number,
  //   default: 0
  // },
 

});


module.exports = Series = mongoose.model('series', SeriesSchema);