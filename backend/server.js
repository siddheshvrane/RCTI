const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

// Connect to MongoDB
// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Run startup scripts only once
        const updateFacultyExperience = require('./utils/updateFacultyExperience');
        const seedAdmin = require('./utils/seedAdmin');
        try {
            updateFacultyExperience().catch(e => console.error(e));
            seedAdmin().catch(e => console.error(e));
        } catch (error) {
            console.error('Failed to run startup scripts:', error);
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.get('/api/test-db', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

        await mongoose.connect(process.env.MONGO_URI);

        res.json({
            status: 'success',
            connectionState: stateMap[state],
            mongoUriPresent: !!process.env.MONGO_URI,
            dbName: mongoose.connection.name
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.code,
            name: error.name,
            mongoUriPresent: !!process.env.MONGO_URI
        });
    }
});
app.use('/api/courses', require('./routes/courses'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/registrations', require('./routes/registrations'));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
