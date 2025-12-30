const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        // Update faculty experience on server startup
        const updateFacultyExperience = require('./utils/updateFacultyExperience');
        const seedAdmin = require('./utils/seedAdmin');
        try {
            await updateFacultyExperience();
            await seedAdmin();
        } catch (error) {
            console.error('Failed to run startup scripts:', error);
        }
    })
    .catch(err => console.log(err));

// Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/registrations', require('./routes/registrations'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
