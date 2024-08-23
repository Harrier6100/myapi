const mongodb = require('mongodb');
const MongoServerError = mongodb.MongoServerError;

module.exports = (err, req, res, next) => {
    if (err instanceof MongoServerError) {
        if (err.code === 11000) {
            res.status(409).json({
                error: err.message
            });
        } else {
            res.status(500).json({
                error: err.message
            });
            next(err);
        }
    } else {
        res.status(500).json({
            error: err.message
        });
        next(err);
    }
};