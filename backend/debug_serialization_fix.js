const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Faculty = require('./models/Faculty');

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Attempting verify serialization WITH LEAN()...');
        const courses = await Course.find().populate('instructors', 'name -_id').lean();
        console.log('Query successful.');

        const json = JSON.stringify(courses);
        console.log('Serialization successful. Length:', json.length);

    } catch (err) {
        console.error('CRASH DURING DEBUG:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

debug();
