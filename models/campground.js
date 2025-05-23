const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review")

const CampgroundSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type:Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async(doc) => {
  if(doc){
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
