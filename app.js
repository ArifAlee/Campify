if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const sanitizeV5 = require('./utilities/mongoSanitizeV5.js');
const express = require("express");
const app = express();
app.set('query parser', 'extended');
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/expressError");
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const helmet = require("helmet")
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/Campify"
const MongoStore = require('connect-mongo');



const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const { storeReturnTo } = require("./utilities/middleware.js");

mongoose
  .connect(dbUrl) 
  .then(() => console.log("Connected to campify DB"))
  .catch((e) => console.log("error connecting to DB", e));

app.engine("ejs", ejsMate);

//View engine for routing EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// MIDDLEWARE
app.use(express.urlencoded({ extended: true })); // parse req.body
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: '_' }));

const secret = process.env.SECRET || "mveMjsu9p"

const store = MongoStore.create({
  mongoUrl:dbUrl,
  touchAfter: 24 * 60 * 60,
  secret
})
store.on("error", (error) => {
  console.log("error connecting session to mongodb", error)
})

const sessionConfig = {
  store,
  name: "_cs",
  secret: "mveMjsu9p",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //extra security
    // secure:true  ---uncomment when live in production
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzm6syibq/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//Passport for authentication and sessions
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(storeReturnTo)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next()  
}); 

//Middleware for return back to previous url before clicking login button (/login)
app.use((req, res, next) => {
  if(req.originalUrl !== "/login" && req.method === "GET"){
    req.session.returnTo = req.originalUrl;
  }
  next()
})
//Routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.get("/", (req, res) => {
  res.render("home.ejs");
});

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
