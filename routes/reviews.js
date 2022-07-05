const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Mountain = require('../models/mountain');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//reviews

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const mountain = await Mountain.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    mountain.reviews.push(review);
    await review.save();
    await mountain.save();
    req.flash('success', 'Created new review');
    res.redirect(`/mountains/${mountain._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Mountain.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/mountains/${id}`);
}))

module.exports = router;