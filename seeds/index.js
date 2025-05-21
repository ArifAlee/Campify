const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedhelps");
const cities = require("./cities");

mongoose
  .connect("mongodb://127.0.0.1:27017/Campify")
  .then(() => console.log("Connected to campify DB"))
  .catch((e) => console.log("error connecting to DB", e));

//populating the database with inital seeds
//using seedhelps.js and cities.js to create randomized campgrounds that will populate the database

const sample = array => array[Math.floor(Math.random() * array.length)]



const seedDB = async function () {
  await Campground.deleteMany();

  for (let i = 0; i < 50; i++) {
    const randNum = Math.floor(Math.random() * 76);
    const price = Math.floor(Math.random() * 20) + 10; 

    const camp = new Campground({
        author: "682da221dee500db3a72840c",
        name: `${sample(descriptors)} ${sample(places)}`,
        location: `${cities[randNum].city}, ${cities[randNum].country}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam voluptatibus et repudiandae quae dolorem! Asperiores accusantium obcaecati suscipit quaerat est eligendi cupiditate dolores magni, nulla, ipsa quisquam quibusdam voluptas expedita!",
        price
    });

    await camp.save();
  }
};
 //close connection
seedDB().then(() => mongoose.connection.close())
