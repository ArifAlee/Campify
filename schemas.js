const sanitizeHtml = require("sanitize-html")
const baseJoi = require("joi");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});
const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    name: Joi.string().max(30).required().escapeHTML(),
    location: Joi.string().max(75).required().escapeHTML(),
    price: Joi.number().min(0).required(),
    description: Joi.string().max(500).required().escapeHTML()
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().min(5).max(150).required().escapeHTML(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});
