const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/expressError");
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/User")

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user")

mongoose
  .connect("mongodb://127.0.0.1:27017/Campify")
  .then(() => console.log("Connected to campify DB"))
  .catch((e) => console.log("error connecting to DB", e));

app.engine("ejs", ejsMate);

//View engine for routing EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

// MIDDLEWARE
app.use(express.urlencoded({ extended: true })); // parse req.body
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const sessionConfig = {
  secret: "thisisneededandneedstobebetter",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //extra security
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()  
}); 

//Passport for authentication and sessions
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//ERROR HANDLING
app.use((err, req, res, next) => {
  const { message = "Something went wrong", status = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong.";
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
