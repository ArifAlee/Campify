const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds")
const { validateCampground, checkAuth, isLoggedIn } = require("../middleware");



router.get("/", campgrounds.index);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post("/", isLoggedIn, validateCampground, campgrounds.createCampground);

router.get("/:id", campgrounds.showCampground);

router.get("/:id/edit", isLoggedIn, checkAuth, campgrounds.renderEditForm);

router.put("/:id", isLoggedIn, checkAuth, validateCampground, campgrounds.updateCampground);

router.delete("/:id", isLoggedIn, checkAuth, campgrounds.deleteCampground);

module.exports = router;
