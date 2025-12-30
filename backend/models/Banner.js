const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    title: { type: String, default: '' }
}, { timestamps: true });

BannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

BannerSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Banner', BannerSchema);
