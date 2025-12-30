const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Faculty = require('./models/Faculty');

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Simple Find
        console.log('1. Finding courses without populate...');
        const courses = await Course.find().lean();
        console.log(`Found ${courses.length} courses.`);

        // 2. Populate Full
        console.log('2. Populating instructors (full)...');
        // Use a small limit to fail fast if it's data specific
        const coursesPop = await Course.find().populate('instructors').limit(1);
        console.log('Populated one course completely.');

        // 3. Populate with Select
        console.log('3. Populating instructors with select...');
        const coursesSelect = await Course.find().populate('instructors', 'name -_id');
        console.log('Success populate select.');

    } catch (err) {
        console.error('ERROR AT STEP:', err);
        if (err.stack) console.error(err.stack);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

debug();
