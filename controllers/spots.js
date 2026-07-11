const { cloudinary } = require('../cloudinary');
const Spot = require('../models/spot');
const mongoose = require('mongoose');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res, next) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots })
}


module.exports.renderNewForm = (req, res) => {
    res.render('spots/new');
}

module.exports.createSpot = async (req, res, next) => {
    console.log('Input location:', req.body.spot.location);
    try {
        const geoData = await maptilerClient.geocoding.forward(req.body.spot.location, {limit: 1});
        // console.log(geoData);
        
        if (!geoData.features?.length) {
            req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
            return res.redirect('/spots/new');
        }

        const spot = new Spot(req.body.spot);

        spot.geometry = geoData.features[0].geometry;
        spot.location = geoData.features[0].place_name;

        spot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        spot.author = req.user._id;
        await spot.save();
        req.flash('success', 'Successfully made a new spot!');
        res.redirect(`/spots/${spot._id}`);
    } catch (e) {
        next(e);
    }
}

module.exports.showSpot = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
    }
    const spot = await Spot.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(spot);

    if (!spot) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
    }
    res.render('spots/show', { spot });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
        req.flash('error', 'Cannot edit find that spot!');
        return res.redirect('/spots');
    }
    res.render('spots/edit', { spot })
}

module.exports.updateSpot = async (req, res, next) => {
    try {
        const { id } = req.params;

        const geoData = await maptilerClient.geocoding.forward(req.body.spot.location, {
            limit: 5,
            country: ['vn'],
            language: 'vi'
        });
        console.log(JSON.stringify(geoData.features.map(f => ({
            place_name: f.place_name,
            place_type: f.place_type,
            relevance: f.relevance
        })), null, 2));

        if (!geoData.features?.length) {
            req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
            return res.redirect(`/spots/${id}/edit`);
        }

        const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot }, { new: true });

        spot.geometry = geoData.features[0].geometry;
        spot.location = geoData.features[0].place_name;

        const imgs = (req.files || []).map(f => ({ url: f.path, filename: f.filename }));
        spot.images.push(...imgs);

        if (req.body.deleteImages) {
            const deleteImages = Array.isArray(req.body.deleteImages)
                ? req.body.deleteImages
                : [req.body.deleteImages];
            await Promise.all(deleteImages.map(filename => cloudinary.uploader.destroy(filename)));
            await spot.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });
        }

        await spot.save();
        req.flash('success', 'Successfully updated spot!');
        res.redirect(`/spots/${spot._id}`);
    } catch (e) {
        next(e);
    }
}

module.exports.deleteSpot = async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted spot!')
    res.redirect('/spots');
}