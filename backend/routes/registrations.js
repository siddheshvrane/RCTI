const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// @route   POST api/registrations
// @desc    Register a new student
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, course, message } = req.body;

        const registration = await Registration.create({
            name,
            email,
            phone,
            course,
            message
        });

        res.status(201).json({
            success: true,
            data: registration
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
});

// @route   GET api/registrations
// @desc    Get all registrations
// @access  Private (Admin)
router.get('/', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   DELETE api/registrations/:id
// @desc    Delete a registration
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: 'Registration not found'
            });
        }

        await registration.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;
