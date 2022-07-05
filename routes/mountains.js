const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateMountain } = require('../middleware');

const Mountain = require('../models/mountain');


router.get('/', catchAsync(async (req, res) => {
    const mountains = await Mountain.find({});
    res.render('mountains/index', { mountains })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('mountains/new');
})


router.post('/', isLoggedIn, validateMountain, catchAsync(async (req, res, next) => {
    const mountain = new Mountain(req.body.mountain);
    mountain.author = req.user._id;
    await mountain.save();
    req.flash('success', 'Successfully made a new mountain!');
    res.redirect(`/mountains/${mountain._id}`)
}))

//SHOW
router.get('/:id', catchAsync(async (req, res,) => {
    const mountain = await Mountain.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(mountain);
    if (!mountain) {
        req.flash('error', 'Cannot find that mountain!');
        return res.redirect('/mountains');
    }
    res.render('mountains/show', { mountain });
}));

//EDIT
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const mountain = await Mountain.findById(id)
    if (!mountain) {
        req.flash('error', 'Cannot find that mountain!');
        return res.redirect('/mountains');
    }
    res.render('mountains/edit', { mountain });
}))

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const mountain = await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
    req.flash('success', 'Successfully update a new mountain!');
    res.redirect(`/mountains/${mountain._id}`)
}));
//DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mountain.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mountain');
    res.redirect('/mountains');
}))

module.exports = router;