const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
}

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Campify!");
      res.redirect("/campgrounds");
    });
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
}

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
}

module.exports.login = (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back ${username}`);
    const redirectUrl = res.locals.returnTo || res.locals.previousUrl || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    const redirectUrl = res.locals.returnTo || res.locals.previousUrl;
    req.flash("success", "You've been logged out");
    res.redirect(redirectUrl);
  });
}


