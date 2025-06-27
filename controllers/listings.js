const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
// const Listing = require("../models/listing");

// 1. Show all listings (with optional category filter)
module.exports.index = async (req, res) => {
  const { category } = req.query;

  let allListings;
  if (category && category !== "all") {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  const categories = [
    "Beach", "Mountain", "Village", "City", "Desert",
    "Lakefront", "Cabin", "Camping", "Forest", "Boat",
    "Countryside", "Luxe", "Castle"
  ];

  res.render("listings/index", { allListings, category, categories, q: "" });

};


// 2. Render new listing form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// 3. Create new listing
module.exports.createListing = async (req, res) => {
  const { listing } = req.body;
  const url = req.file?.path;
  const filename = req.file?.filename;

  const newListing = new Listing({
    ...listing,
    owner: req.user._id,
    image: { url, filename },
  });

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};


//search listing
module.exports.searchListings = async (req, res) => {
  const { q } = req.query;

  let allListings = [];

  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), "i"); // case-insensitive
    allListings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex }
      ]
    });
  };

  // get all categories so category buttons still show
  const categories = [
    "Beach", "Mountain", "Village", "City", "Desert", "Lakefront", "Cabin",
    "Camping", "Forest", "Boat", "Countryside", "Luxe", "Castle"
  ];

  res.render("listings/index", {
    allListings,
    category: null, 
    categories,
    q
  });
};


// 4. Show listing details
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
const listing = await Listing.findById(req.params.id)
  .populate("owner")
  .populate({
    path: "reviews",
    populate: {
      path: "author",
      select: "username" // optional, for performance
    }
  });
  if (!listing) {
    const err = new ExpressError(404, "Listing does not exist");
    return res.status(404).render("users/error", { err });
  }
  res.render("listings/show", { listing });
};

// 5. Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    const err = new ExpressError(404, "Listing does not exist");
    return res.status(404).render("users/error", { err });
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300/w_250");

  res.render("listings/edit", { listing, originalImageUrl });
};

// 6. Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  if (!req.body.listing) {
    req.flash("error", "Invalid request data.");
    return res.redirect(`/listings/${id}`);
  }

  const { listing } = req.body;
  const updatedData = { ...listing };

  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${updatedListing._id}`);
};







// 7. Delete listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};