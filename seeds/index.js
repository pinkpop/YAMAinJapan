const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Mountain = require('../models/mountain');

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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Mountain.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const mount = new Mountain({
            author: '62c23cd1e8101cad3655273b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dicdombr3/image/upload/v1660651058/YAMAinJapan/hyinx9zek1oysdtgxcd4.jpg',
                    filename: 'YAMAinJapan/hyinx9zek1oysdtgxcd4'
                },
                {
                    url: 'https://res.cloudinary.com/dicdombr3/image/upload/v1660651058/YAMAinJapan/ummdgtaoppgz0d1hjnej.jpg',
                    filename: 'YAMAinJapan/ummdgtaoppgz0d1hjnej'
                }
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque magni et vel pariatur dolor soluta sint ipsam molestias unde, ad dolorem, ratione sit accusamus odit nemo quam voluptate earum fugiat.',
            height: random1000
        })
        await mount.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})