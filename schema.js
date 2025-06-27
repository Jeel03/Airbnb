// schema.js
const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().valid(
      "Beach",
      "Mountain",
      "Village",
      "City",
      "Desert",
      "Lakefront",
      "Cabin",
      "Camping",
      "Forest",
      "Boat",
      "Countryside",
      "Luxe",
      "Castle"
    ).required(),
    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null)
    }).allow(null)
  }).required()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  listingSchema,
  reviewSchema,
  userSchema
};


