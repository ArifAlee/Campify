const Campground = require("../models/campground");
const Review = require("../models/review")
const { campgroundSchema, reviewSchema } = require("../schemas");
const ExpressError = require("./expressError")



module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


//Checks if user is logged in before allowing access to certain webpages
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    req.session.previousUrl = req.session.returnTo;
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.checkAuth = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (req.user && !campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next()
};

module.exports.checkReviewAuth = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (req.user && !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next()
};
