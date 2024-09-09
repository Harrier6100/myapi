const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertyNames = Schema({
    language: String,
    name: String,
    uom: String,
}, { _id: false });

const physicalPropertyNames = new Schema({
    _id: Number,
    code: String,
    name: String,
    uom: String,
    numberSize: Number,
    propertyNames: [propertyNames],
    remarks: String,
    createdBy: String,
    createdAt: Date,
    updatedBy: String,
    updatedAt: Date,
}, { versionKey: false });

physicalPropertyNames.index({
    code: 1,
}, { unique: true });

const sequencesSchema = new Schema({
    _id: String,
    number: Number,
}, { versionKey: false });

const sequences = mongoose.models.sequences
    ? mongoose.models.sequences
    : mongoose.model('sequences', sequencesSchema);

physicalPropertyNames.pre('save', function(next) {
    if (this._id) {
        sequences.findById('physicalPropertyNames')
        .then(sequence => {
            if (sequence) {
                if (this._id > sequence.number) {
                    sequence.number = this._id;
                    sequence.save();
                }
            } else {
                sequences.create({
                    _id: 'physicalPropertyNames',
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
        { _id: 'physicalPropertyNames' },
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

module.exports = mongoose.model('physicalPropertyNames', physicalPropertyNames);