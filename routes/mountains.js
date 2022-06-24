const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { mountainSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Mountain = require('../models/mountain');

const validateMountain = (req, res, next) => {
    const { error } = mountainSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const mountains = await Mountain.find({});
    res.render('mountains/index', { mountains })
}));
//NEW.ejs
router.get('/new', (req, res) => {
    res.render('mountains/new');
})

router.post('/', validateMountain, catchAsync(async (req, res, next) => {
    // if (!req.body.mountain) throw new ExpressError("Invalid Mountain", 400);
    // const mountainSchema = Joi.object({
    //     mountain: Joi.object({
    //         title: Joi.string().required(),
    //         height: Joi.number().required().min(0),
    //         image: Joi.string().required(),
    //         location: Joi.string().required(),
    //         description: Joi.string().required()
    //     }).required()
    // })
    // const { error } = mountainSchema.validate(req.body);
    // if (error) {
    //     const msg = error.details.map(el => el.message).join(',')
    //     throw new ExpressError(msg, 400)
    // }
    const mountain = new Mountain(req.body.mountain);
    await mountain.save();
    res.redirect(`/mountains/${mountain._id}`)
}))
//SHOW
router.get('/:id', catchAsync(async (req, res,) => {
    const mountain = await Mountain.findById(req.params.id).populate('reviews');
    res.render('mountains/show', { mountain });
}));

//EDIT
router.get('/:id/edit', catchAsync(async (req, res) => {
    const mountain = await Mountain.findById(req.params.id)
    res.render('mountains/edit', { mountain });
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const mountain = await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
    res.redirect(`/mountains/${mountain._id}`)
}));
//DELETE
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mountain.findByIdAndDelete(id);
    res.redirect('/mountains');
}))

module.exports = router;