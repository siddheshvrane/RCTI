const mongoose = require('mongoose');

const institutePhotoSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InstitutePhoto', institutePhotoSchema);
