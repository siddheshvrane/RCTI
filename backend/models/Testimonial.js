const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    courses: { type: [String], required: true }, // Changed from course to courses array
    review: { type: String, required: true },    // Changed from text to review
    rating: { type: Number, default: 5 },
    result: { type: String },                    // Added result field
    imageUrl: { type: String }
}, { timestamps: true });

TestimonialSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

TestimonialSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
