const Joi = require('@hapi/joi');

module.exports = {
  validateBody: (schemaType) => {
    return (req,res, next) => {
      const result = schemaType.validate(req.body);
      if(result.error) {
        return res.status(400).json(result.error);
      }
      
      if(!req.value) {
        req.value = {}
      }

      req.value['body'] = result.value;

      next();
      // req.value.body insted of req.body

    }
  },

  schemas : {
    authSchema: Joi.object({

      email: Joi.string().email().required(),
      password: Joi.string().required()
      
    }),
    profileSchema: Joi.object({
      displayName: Joi.string(),
      city: Joi.string(),
      description: Joi.string(),
      patreon: Joi.string().optional(),
      tools: Joi.string(),
      // tools: Joi.array().items(Joi.string()).optional(),
      // socialMedia: Joi.array().items(Joi.string()),
    }),
    seriesSchema: Joi.object({
      seriesTitle: Joi.string(),
      seriesUrl: Joi.string(),
      genrePrimary: Joi.string(),
      genreSecondary: Joi.string(),
      summary: Joi.string(),
      tags: Joi.string(),
      consent: Joi.string(),
      condition: Joi.string(),
      isNewSeries: Joi.string(),
      // seriesId: Joi.string(),
    }),
    chapterSchema: Joi.object({
      chapterTitle: Joi.string(),
      chapterCover: Joi.string(),
      chapterPages: Joi.string(),
      chapterUrl: Joi.string(),
      chapterNumber: Joi.string(),
      chapterDescription: Joi.string(),
      tags: Joi.string(),
      chapterLikes: Joi.string(),
      matureContents: Joi.string(),
      openForComments: Joi.string(),
      seriesId: Joi.string(),
      chapterId: Joi.string(),
    }),
  }
}
