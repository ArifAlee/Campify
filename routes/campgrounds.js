const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds")
const { validateCampground, checkAuth, isLoggedIn } = require("../utilities/middleware");
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({storage})

router.route("/")
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array("image"), validateCampground, campgrounds.createCampground)

router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(campgrounds.showCampground)
    .put(isLoggedIn, checkAuth, upload.array("image"), validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, checkAuth, campgrounds.deleteCampground)

router.get("/:id/edit", isLoggedIn, checkAuth, campgrounds.renderEditForm);



module.exports = router;
