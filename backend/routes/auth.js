const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT Token
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

        jwt.sign(
            payload,
            secret,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { name: user.username } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Admin Profile (Username/Password)
router.put('/update', require('../middleware/auth'), async (req, res) => {
    try {
        const { username, password, newPassword } = req.body;
        const userId = req.user.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Allow updating username
        if (username) {
            // Check if username already taken by another user
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        // Allow updating password
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user: { name: user.username } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
