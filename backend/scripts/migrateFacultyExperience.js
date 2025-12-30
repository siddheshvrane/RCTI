const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
require('dotenv').config();

/**
 * Migration script to add experienceYears and joinedYear to existing faculty
 * Parses existing experience strings like "10 Years" to extract numeric value
 * Calculates joinedYear based on current year minus experience years
 */
async function migrateFacultyExperience() {
    try {
        // Connect to database - use MONGO_URI from .env
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI or MONGODB_URI not found in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const faculty = await Faculty.find();
        const currentYear = new Date().getFullYear();

        console.log(`\nMigrating ${faculty.length} faculty members...`);
        console.log('─'.repeat(60));

        for (const member of faculty) {
            // Parse experience string to extract number
            // Handles formats like: "10 Years", "5", "15 years", etc.
            const match = member.experience.match(/(\d+)/);
            const years = match ? parseInt(match[1]) : 0;

            // Calculate joined year
            const joinedYear = currentYear - years;

            // Update fields
            member.experienceYears = years;
            member.joinedYear = joinedYear;

            await member.save();

            console.log(`✓ ${member.name.padEnd(30)} | ${years} years | Joined: ${joinedYear}`);
        }

        console.log('─'.repeat(60));
        console.log(`\n✓ Migration complete! Updated ${faculty.length} faculty members.`);
        console.log(`  Current year: ${currentYear}`);
        console.log(`  All faculty now have experienceYears and joinedYear fields.\n`);

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run migration
migrateFacultyExperience();
