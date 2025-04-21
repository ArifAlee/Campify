const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { campgroundSchema, reviewSchema } = require("./schemas");
const path = require("path");
const Campground = require("./models/campground");
const Review = require("./models/review");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/expressError");

const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")


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


app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)




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
