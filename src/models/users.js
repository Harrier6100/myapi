const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    _id: Number,
    code: String,
    name: String,
    email: String,
    password: String,
    expiryDate: Date,
    createdAt: Date,
    createdBy: String,
    updatedAt: Date,
    updatedBy: String,
}, { versionKey: false });

users.index({
    code: 1,
}, { unique: true });

const sequencesSchema = new Schema({
    _id: String,
    number: Number,
}, { versionKey: false });

const sequences = mongoose.models.sequences
    ? mongoose.models.sequences
    : mongoose.model('sequences', sequencesSchema);

users.pre('save', function(next) {
    if (this._id) {
        sequences.findById('users')
        .then(sequence => {
            if (sequence) {
                if (this._id > sequence.number) {
                    sequence.number = this._id;
                    sequence.save();
                }
            } else {
                sequences.create({
                    _id: 'users',
                    number: this._id,
                });
            }
        })
        .catch(err => {
            throw err;
        });
        return next();
    }
    sequences.findByIdAndUpdate(
        { _id: 'users' },
        { $inc: { number: 1 } },
        { new: true, upsert: true },
    )
    .then(sequence => {
        this._id = sequence.number;
        next();
    })
    .catch(err => {
        throw err;
    });
});

module.exports = mongoose.model('users', users);