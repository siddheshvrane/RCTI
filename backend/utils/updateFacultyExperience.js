const Faculty = require('../models/Faculty');

/**
 * Updates faculty experience based on current year
 * Calculates years of experience from joinedYear
 * Updates both experienceYears (numeric) and experience (string) fields
 */
async function updateFacultyExperience() {
    try {
        const currentYear = new Date().getFullYear();
        const faculty = await Faculty.find();

        let updatedCount = 0;

        for (const member of faculty) {
            // Calculate years of experience from joined year
            const yearsOfExperience = currentYear - member.joinedYear;

            // Only update if experience has changed
            if (member.experienceYears !== yearsOfExperience) {
                member.experienceYears = yearsOfExperience;
                member.experience = `${yearsOfExperience} Years`;
                await member.save();
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`✓ Updated experience for ${updatedCount} faculty members (Year: ${currentYear})`);
        } else {
            console.log(`✓ Faculty experience is up to date (Year: ${currentYear})`);
        }

        return updatedCount;
    } catch (error) {
        console.error('Error updating faculty experience:', error);
        throw error;
    }
}

module.exports = updateFacultyExperience;
