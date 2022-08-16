const Mountain = require('../models/mountain');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const mountains = await Mountain.find({});
    res.render('mountains/index', { mountains })
};

module.exports.renderNewForm = (req, res) => {
    res.render('mountains/new');
}

module.exports.createMountain = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.mountain.location,
        limit: 1
    }).send()
    const mountain = new Mountain(req.body.mountain);
    mountain.geometry = geoData.body.features[0].geometry;
    mountain.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    mountain.author = req.user._id;
    await mountain.save();
    req.flash('success', 'Successfully made a new mountain!');
    res.redirect(`/mountains/${mountain._id}`)
}

module.exports.showMountain = async (req, res,) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const mountain = await Mountain.findById(id)
    if (!mountain) {
        req.flash('error', 'Cannot find that mountain!');
        return res.redirect('/mountains');
    }
    res.render('mountains/edit', { mountain });
}

module.exports.updateMountain = async (req, res) => {
    const { id } = req.params;
    const mountain = await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    mountain.images.push(...imgs);
    await mountain.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully update a new mountain!');
    res.redirect(`/mountains/${mountain._id}`)
}

module.exports.deleteMountain = async (req, res) => {
    const { id } = req.params;
    await Mountain.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mountain');
    res.redirect('/mountains');
}