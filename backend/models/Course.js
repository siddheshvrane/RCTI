const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    fees: { type: String, required: true },
    description: { type: String },
    introduction: { type: String },
    about: { type: String },
    objectives: { type: [String] },
    outcomes: { type: [String] },
    modules: { type: [String] },
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
    bannerUrl: { type: String }
}, { timestamps: true });

// Add a virtual field 'id' that maps to '_id'
CourseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
CourseSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Course', CourseSchema);
