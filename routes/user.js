const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash("success", "Welcome to Campify!");
    res.redirect("/campgrounds");
  } catch (e) {
    if (e.keyPattern) {
      req.flash(
        "error",
        "Email has already been used to register, please try to log in"
      );
      res.redirect("/register");
    } else {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});


router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    const {username} = req.body;
    req.flash("success", `Welcome back! Logged in as ${username}`);
    res.redirect("/campgrounds");
  });

module.exports = router;
