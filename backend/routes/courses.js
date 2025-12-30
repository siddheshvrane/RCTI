const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructors', 'name').lean(); // Include _id for admin form editing
        // Note: populate('instructors', 'name') returns [{ _id: ..., name: ... }]
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a course
router.post('/', async (req, res) => {
    // req.body.instructors should be an array of Faculty ObjectIds
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();

        // Sync: Add this course ID to courses list of assigned instructors
        if (newCourse.instructors && newCourse.instructors.length > 0) {
            await Faculty.updateMany(
                { _id: { $in: newCourse.instructors } },
                { $addToSet: { courses: newCourse._id } }
            );
        }

        const populatedCourse = await Course.findById(newCourse._id).populate('instructors', 'name');
        res.status(201).json(populatedCourse);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Update a course
router.put('/:id', async (req, res) => {
    try {
        const oldCourse = await Course.findById(req.params.id);
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('instructors', 'name');

        const oldInstructorIds = oldCourse.instructors.map(id => id.toString());
        const newInstructorIds = (req.body.instructors || []).map(id => id.toString());

        // 1. Remove course from faculty who no longer teach it
        const instructorsToRemoveFrom = oldInstructorIds.filter(id => !newInstructorIds.includes(id));
        if (instructorsToRemoveFrom.length > 0) {
            await Faculty.updateMany(
                { _id: { $in: instructorsToRemoveFrom } },
                { $pull: { courses: oldCourse._id } }
            );
        }

        // 2. Add course to faculty who now teach it
        const instructorsToAddTo = newInstructorIds.filter(id => !oldInstructorIds.includes(id));
        if (instructorsToAddTo.length > 0) {
            await Faculty.updateMany(
                { _id: { $in: instructorsToAddTo } },
                { $addToSet: { courses: oldCourse._id } }
            );
        }

        res.json(updatedCourse);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    try {
        const courseToDelete = await Course.findById(req.params.id);
        if (courseToDelete) {
            // Sync: Remove this course from all faculty
            if (courseToDelete.instructors && courseToDelete.instructors.length > 0) {
                await Faculty.updateMany(
                    { _id: { $in: courseToDelete.instructors } },
                    { $pull: { courses: courseToDelete._id } }
                );
            }
            await Course.findByIdAndDelete(req.params.id);
            res.json({ message: 'Course deleted' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
