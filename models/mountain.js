const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const MountainSchema = new Schema({
    title: String,
    image: String,
    height: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

MountainSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Mountain', MountainSchema);