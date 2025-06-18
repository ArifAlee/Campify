if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const User = require("../models/user");
const Review = require("../models/review");
const { descriptors, places } = require("./seedhelps");
const cities = require("./cities");
const users = require("./users")
let reviews = require("./reviews");


mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to campify DB"))
  .catch((e) => console.log("error connecting to DB", e));

//populating the database with inital seeds
//using seedhelps.js and cities.js to create randomized campgrounds that will populate the database

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
  await Campground.deleteMany();
  // await User.deleteMany();
  // await Review.deleteMany();

  // create users
  // for (let i = 0; i < users.length; i++) {
  //   const { username, email, password } = users[i]
  //   const newUser = new User({username, email})
  //   const registerUser = await User.register(newUser, password);
  //   await registerUser.save()
  // }

  // create campgrounds
  for (let i = 0; i < 100; i++) {
    const randNum = Math.floor(Math.random() * 76);
    const randUser = Math.floor(Math.random() * 5);
    const price = Math.floor(Math.random() * 20) + 10;
    const author = await User.findByUsername(users[randUser].username)
    const camp = new Campground({
      author: author._id,
      name: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[randNum].city}, ${cities[randNum].country}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[randNum].longitude, cities[randNum].latitude
        ]
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam voluptatibus et repudiandae quae dolorem! Asperiores accusantium obcaecati suscipit quaerat est eligendi cupiditate dolores magni, nulla, ipsa quisquam quibusdam voluptas expedita!",
        price,
      images: [
        {
          url: "https://res.cloudinary.com/dzm6syibq/image/upload/v1748865569/Campify/ct03yjjjrmdf6dwpobyi.jpg",
          filename: "Campify/ct03yjjjrmdf6dwpobyi",
        },
        {
          url: "https://res.cloudinary.com/dzm6syibq/image/upload/v1748865568/Campify/bchshhelrbrkmanmdrnb.jpg",
          filename: "Campify/bchshhelrbrkmanmdrnb",
        },
        {
          url: "https://res.cloudinary.com/dzm6syibq/image/upload/v1749033437/Campify/gmccegkokoozfyufw1nd.jpg",
          filename: "Campify/gmccegkokoozfyufw1nd",
        },
      ],
    });
    // create reviews
    const review1 = new Review(sample(reviews))
    await review1.save()
    const review2 = new Review(sample(reviews))
    await review2.save()
    const review3 = new Review(sample(reviews))
    await review3.save()
    camp.reviews.push(review1, review2, review3)
    await camp.save();
  }
};
//close connection
seedDB().then(() => mongoose.connection.close());
