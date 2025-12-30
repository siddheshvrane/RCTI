const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

// Get all faculty
router.get('/', async (req, res) => {
    try {
        // Sort by experienceYears descending (highest experience first)
        const faculty = await Faculty.find()
            .populate('courses', 'title')
            .sort({ experienceYears: -1 })
            .lean();
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a faculty member
router.post('/', async (req, res) => {
    // req.body.courses should be an array of Course ObjectIds
    const faculty = new Faculty(req.body);
    try {
        const newFaculty = await faculty.save();

        // Sync: Add this faculty ID to instructors list of assigned courses
        if (newFaculty.courses && newFaculty.courses.length > 0) {
            await Course.updateMany(
                { _id: { $in: newFaculty.courses } },
                { $addToSet: { instructors: newFaculty._id } }
            );
        }

        const populatedFaculty = await Faculty.findById(newFaculty._id).populate('courses', 'title');
        res.status(201).json(populatedFaculty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a faculty member
router.put('/:id', async (req, res) => {
    try {
        const oldFaculty = await Faculty.findById(req.params.id);
        const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('courses', 'title');

        const oldCourseIds = oldFaculty.courses.map(id => id.toString());
        const newCourseIds = (req.body.courses || []).map(id => id.toString());

        // 1. Remove faculty from courses they no longer teach
        const coursesToRemoveFrom = oldCourseIds.filter(id => !newCourseIds.includes(id));
        if (coursesToRemoveFrom.length > 0) {
            await Course.updateMany(
                { _id: { $in: coursesToRemoveFrom } },
                { $pull: { instructors: oldFaculty._id } }
            );
        }

        // 2. Add faculty to new courses
        const coursesToAddTo = newCourseIds.filter(id => !oldCourseIds.includes(id));
        if (coursesToAddTo.length > 0) {
            await Course.updateMany(
                { _id: { $in: coursesToAddTo } },
                { $addToSet: { instructors: oldFaculty._id } }
            );
        }

        res.json(updatedFaculty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a faculty member
router.delete('/:id', async (req, res) => {
    try {
        const facultyToDelete = await Faculty.findById(req.params.id);
        if (facultyToDelete) {
            // Sync: Remove this faculty from all courses
            if (facultyToDelete.courses && facultyToDelete.courses.length > 0) {
                await Course.updateMany(
                    { _id: { $in: facultyToDelete.courses } },
                    { $pull: { instructors: facultyToDelete._id } }
                );
            }
            await Faculty.findByIdAndDelete(req.params.id);
            res.json({ message: 'Faculty deleted' });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
