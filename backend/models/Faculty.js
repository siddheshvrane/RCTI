const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },  // Display string e.g., "10 Years"
    experienceYears: { type: Number, default: 0 },  // Numeric value for sorting
    joinedYear: { type: Number, default: () => new Date().getFullYear() },  // Year faculty joined
    imageUrl: { type: String },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

FacultySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

FacultySchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Faculty', FacultySchema);
