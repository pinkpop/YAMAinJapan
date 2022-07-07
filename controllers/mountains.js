const Mountain = require('../models/mountain');

module.exports.index = async (req, res) => {
    const mountains = await Mountain.find({});
    res.render('mountains/index', { mountains })
};

module.exports.renderNewForm = (req, res) => {
    res.render('mountains/new');
}

module.exports.createMountain = async (req, res, next) => {
    const mountain = new Mountain(req.body.mountain);
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
    req.flash('success', 'Successfully update a new mountain!');
    res.redirect(`/mountains/${mountain._id}`)
}

module.exports.deleteMountain = async (req, res) => {
    const { id } = req.params;
    await Mountain.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mountain');
    res.redirect('/mountains');
}