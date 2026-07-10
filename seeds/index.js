const mongoose = require('mongoose');
const province = require('./province');
const { places, descriptors } = require('./seedHelpers');
const Spot = require('../models/spot');

mongoose.connect('mongodb://127.0.0.1:27017/travelSpot')
    .then(() => {
        console.log('MongoDB Connected!');
    })
    .catch(err => {
        console.log(err);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Spot.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomPro = Math.floor(Math.random() * province.length)
        const price = Math.floor(Math.random() * 900000) + 100000
        const spot = new Spot({
            author: '6a491e0f479e1c2fa8da4096',
            location: `${province[randomPro].city}, ${province[randomPro].province}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            description: 'Cá nhân mình thì khuyên giữ lại trong lúc học. Sau này đến phần Cloudinary, upload ảnh hay chỉnh giao diện thì bạn sẽ thấy website sinh động hơn, dễ theo dõi kết quả.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomPro].longitude,
                    cities[randomPro].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ima6ulhi/image/upload/v1783682038/TravelSpot/id3twxmmi47vfbajwnnk.jpg',
                    filename: 'TravelSpot/id3twxmmi47vfbajwnnk'
                },
                {
                    url: 'https://res.cloudinary.com/ima6ulhi/image/upload/v1783682038/TravelSpot/hrjikju7uqhdwxxn5urh.jpg',
                    filename: 'TravelSpot/hrjikju7uqhdwxxn5urh'
                }
            ]
        })
        await spot.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
});
