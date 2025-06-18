const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const allCampgrounds = await Campground.find({});
  // const campgrounds = allCampgrounds.map((cg) => cg.toObject());
  res.render("campgrounds/index", { campgrounds: allCampgrounds});
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Succcessfully created new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    res.render("campgrounds/details", { campground });
  } catch (error) {
    if (error) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
  }
};

module.exports.renderEditForm = async (req, res) => {
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
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { runValidators: true, new: true }
    );
    campground.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Campground updated.");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    req.flash("error", "Campground not found.");
    return res.redirect("/campgrounds");
  }
};

module.exports.deleteCampground = async (req, res) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted.");
    res.redirect("/campgrounds");
  } catch (error) {
    req.flash("error", "Campground not found.");
    return res.redirect("/campgrounds");
  }
};
