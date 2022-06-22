const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { mountainSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const Mountain = require('./models/mountain');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// const validateMountain = (req, res, next) => {
//     const { error } = mountainSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/mountains', catchAsync(async (req, res) => {
    const mountains = await Mountain.find({});
    res.render('mountains/index', { mountains })
}));
//NEW.ejs
app.get('/mountains/new', (req, res) => {
    res.render('mountains/new');
})

app.post('/mountains', catchAsync(async (req, res, next) => {
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
app.get('/mountains/:id', catchAsync(async (req, res,) => {
    const mountain = await Mountain.findById(req.params.id)
    res.render('mountains/show', { mountain });
}));

//EDIT
app.get('/mountains/:id/edit', catchAsync(async (req, res) => {
    const mountain = await Mountain.findById(req.params.id)
    res.render('mountains/edit', { mountain });
}))

app.put('/mountains/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const mountain = await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
    res.redirect(`/mountains/${mountain._id}`)
}));
//DELETE
app.delete('/mountains/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mountain.findByIdAndDelete(id);
    res.redirect('/mountains');
}))
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oops, something went wrong";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on Port 3000")
})