const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Faculty = require('./models/Faculty');

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        console.log('Attempting to fetch courses with populate...');
        const courses = await Course.find().populate('instructors', 'name -_id');
        console.log('Successfully fetched courses:', JSON.stringify(courses, null, 2));

    } catch (err) {
        console.error('ERROR OCCURRED:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

debug();
