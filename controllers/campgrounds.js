const Campground = require("../models/campground")

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res, next) => {
  res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Succcessfully created new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      })
      .populate("author");
    res.render("campgrounds/details", { campground });
  } catch (error) {
    if (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }
}

module.exports.renderEditForm =  async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  } catch (error) {
    if (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    try {
      const campground = await Campground.findByIdAndUpdate(
        id,
        { ...req.body.campground },
        { runValidators: true, new: true }
      );
      req.flash("success", "Campground updated.");
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }

  module.exports.deleteCampground = async (req, res) => {
    try {
      await Campground.findByIdAndDelete(req.params.id);
      req.flash("success", "Campground deleted.");
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }