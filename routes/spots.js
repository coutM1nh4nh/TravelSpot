const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const spots = require('../controllers/spots')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware.js');
const Spot = require('../models/spot');

router.get('/', catchAsync(spots.index));

router.get('/new', isLoggedIn, spots.renderNewForm);

router.post('/', isLoggedIn, validateSpot, catchAsync(spots.createSpot));

router.get('/:id', catchAsync(spots.showSpot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(spots.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateSpot, catchAsync(spots.updateSpot));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(spots.deleteSpot));

module.exports = router;