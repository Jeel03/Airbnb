const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


// POST /listings/:id/reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE /listings/:id/reviews/:reviewId
router.delete(
  "/:reviewId",
  isReviewAuthor,
   isLoggedIn,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
