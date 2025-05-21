const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utilities/expressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews")
const {validateReview, isLoggedIn, checkReviewAuth} = require("../middleware")


router.post("/", isLoggedIn, validateReview, reviews.createReview);

//If campground is deleted delete all it's reviews too
router.delete("/:reviewId", isLoggedIn, checkReviewAuth, reviews.deleteReview);

module.exports = router;
