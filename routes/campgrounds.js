const express = require("express");
const router = express.Router();
const ExpressError = require("../utilities/expressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", (req, res, next) => {
  res.render("campgrounds/new");
});
router.post("/", validateCampground, async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash("success", "Succcessfully created new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.get("/:id", async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews");
    res.render("campgrounds/details", { campground });
  } catch (error) {
    if (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (error) {
    if (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }
});
router.put("/:id", validateCampground, async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { runValidators: true, new: true }
  );
  req.flash("success", "Campground updated.");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.delete("/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground deleted.");
  res.redirect("/campgrounds");
});

module.exports = router;
