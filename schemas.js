const Joi = require("joi")

module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
      name:Joi.string().max(30).required(),
      location:Joi.string().max(75).required(),
      image:Joi.string().required(),
      price:Joi.number().min(0).required(),
      description:Joi.string().max(500).required()
  }).required()
  })

  module.exports.reviewSchema = Joi.object({
    review : Joi.object({
      body: Joi.string().min(10).max(150).required(),
      rating: Joi.number().min(1).max(5).required()
    }).required()
  })