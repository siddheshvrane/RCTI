const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            // console.log('Admin user already exists');
            return;
        }

        // Hash the default password
        // Note: In a production env, this should be set via environment variables
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const newAdmin = new User({
            username: 'admin',
            password: hashedPassword
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
