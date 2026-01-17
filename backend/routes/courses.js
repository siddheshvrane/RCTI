const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');

// Get all courses (supports ?mode=summary)
router.get('/', async (req, res) => {
    try {
        let query = Course.find();

        // If mode is summary, exclude heavy fields
        if (req.query.mode === 'summary') {
            query = query.select('-introduction -about -objectives -outcomes -modules -instructors');
        } else {
            query = query.populate('instructors', 'name');
        }

        const courses = await query.lean();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single course by ID or Slug (Title)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let course;

        // 1. Try finding by ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            course = await Course.findById(id).populate('instructors', 'name').lean();
        }

        // 2. If not found or not ObjectID, try finding by Slug (matching title)
        if (!course) {
            // Since we don't store slugs, we fetch all titles and match in memory (safe for small dataset)
            // Or we can try regex if we are confident. 
            // Better approach for reliability: Fetch all, generate slug, find match.
            // But for performance on single fetch, let's try regex first? 
            // No, safer to fetch all lean courses and find match to align with frontend logic exactly.
            const allCourses = await Course.find().select('title').lean();
            const matched = allCourses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === id);

            if (matched) {
                course = await Course.findById(matched._id).populate('instructors', 'name').lean();
            }
        }

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
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
