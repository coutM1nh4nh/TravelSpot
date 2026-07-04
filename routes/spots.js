const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { spotSchema } = require('../schemas.js');
const ExpressError = require('../utils/expressError');
const Spot = require('../models/spot');

const validateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res, next) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots })
}));

router.get('/new', (req, res) => {
    res.render('spots/new');
});

router.post('/', validateSpot, catchAsync(async (req, res) => {

    // if (!req.body.spot) throw new ExpressError('Invalid Spot Data', 400);
    const spot = new Spot(req.body.spot);
    await spot.save();
    req.flash('success', 'Successfully made a new spot!');
    res.redirect(`/spots/${spot._id}`);
}))

//display
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
    }

    const spot = await Spot.findById(id).populate('reviews');

    if (!spot) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
    }

    res.render('spots/show', { spot });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
        req.flash('error', 'Cannot edit find that spot!');
        return res.redirect('/spots');
    }
    res.render('spots/edit', { spot })
}));

router.put('/:id', validateSpot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'Successfully updated spot!');
    res.redirect(`/spots/${spot._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted spot!')
    res.redirect('/spots');
}));

module.exports = router;