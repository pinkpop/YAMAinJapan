const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Mountain = require('../models/mountain');
const Review = require('../models/review');
//reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
router.post('/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const mountain = await Mountain.findById(req.params.id);
    const review = new Review(req.body.review);
    mountain.reviews.push(review);
    await review.save();
    await mountain.save();
    req.flash('success', 'Created new review');
    res.redirect(`/mountains/${mountain._id}`);
}))

router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Mountain.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/mountains/${id}`);
}))

module.exports = router;