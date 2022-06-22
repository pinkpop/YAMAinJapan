const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MountainSchema = new Schema({
    title: String,
    image: String,
    height: Number,
    description: String,
    location: String
})

module.exports = mongoose.model('Mountain', MountainSchema);