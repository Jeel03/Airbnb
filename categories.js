const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // adjust path if needed

mongoose.connect("mongodb://127.0.0.1:27017/airbnb") // change to your DB name if different
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Connection error", err));

const categories = [
  "Beach", "Mountain", "Village", "City", "Desert",
  "Lakefront", "Cabin", "Camping"
];

const updateListings = async () => {
  const listings = await Listing.find({ category: { $exists: false } });

  for (let listing of listings) {
    listing.category = categories[Math.floor(Math.random() * categories.length)];
    await listing.save();
  }

  console.log(`✅ Updated ${listings.length} listings with random categories`);
  mongoose.connection.close();
};

updateListings();