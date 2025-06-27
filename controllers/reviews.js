const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const { rating, comment } = req.body.review;

    const review = new Review({ rating, comment });
    review.author = req.user._id;
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "New Review  added successfully!");
    res.redirect(`/listings/${id}`);
  };



  module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};