const { spotSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/expressError');
const Spot = require('./models/spot');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        if (req.method === 'GET') {
            req.session.returnTo = req.originalUrl;
        } else {
            // Với POST/PUT/DELETE thì quay về trang Spot
            req.session.returnTo = `/spots/${req.params.id}`;
        }

        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const spot = await Spot.findById(req.params.id);
    if (!spot.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/spots/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/spots/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}