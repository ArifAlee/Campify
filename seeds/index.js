if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedhelps");
const cities = require("./cities");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


mongoose
  .connect("mongodb://127.0.0.1:27017/Campify")
  .then(() => console.log("Connected to campify DB"))
  .catch((e) => console.log("error connecting to DB", e));

//populating the database with inital seeds
//using seedhelps.js and cities.js to create randomized campgrounds that will populate the database

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
  await Campground.deleteMany();

  for (let i = 0; i < 100; i++) {
    const randNum = Math.floor(Math.random() * 76);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: "682da221dee500db3a72840c",
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
          url: "https://res.cloudinary.com/dzm6syibq/image/upload/v1748865570/Campify/lkx39yo4xygypni2jx0v.jpg",
          filename: "Campify/lkx39yo4xygypni2jx0v",
        },
      ],
    });

    await camp.save();
  }
};
//close connection
seedDB().then(() => mongoose.connection.close());
