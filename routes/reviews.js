const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utilities/expressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post("/", validateReview, async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
  console.log(review);
});

//If campground is deleted delete all it's reviews too
router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
