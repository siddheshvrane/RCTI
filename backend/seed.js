const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Faculty = require('./models/Faculty');
const Testimonial = require('./models/Testimonial');

// Data Definitions
const coursesData = [
    {
        title: 'Basic Computer Course',
        category: 'computer',
        duration: '3',
        level: 'Beginner',
        fees: '5,000',
        description: 'Learn computer fundamentals, Windows OS, MS Office (Word, Excel, PowerPoint), and internet basics.',
        introduction: 'The Basic Computer Course is designed to bridge the digital divide.',
        about: 'This course covers the A-Z of basic computing.',
        objectives: ['Understand basics.', 'Gain proficiency in MS Office.', 'Internet safety.'],
        outcomes: ['Create docs.', 'Spreadsheets.', 'Presentations.'],
        modules: ['Fundamentals', 'Word', 'Excel', 'PowerPoint', 'Internet']
    },
    {
        title: 'Advanced MS Office',
        category: 'computer',
        duration: '2',
        level: 'Intermediate',
        fees: '4,000',
        description: 'Master advanced features of Word, Excel, PowerPoint, and Access.',
        introduction: 'Take your Office skills to the next level.',
        about: 'Deep dive into advanced functionalities.',
        objectives: ['Advanced Excel.', 'Business reports.', 'Presentations.', 'Access DB.'],
        outcomes: ['Data analysis.', 'Macros.', 'Large datasets.'],
        modules: ['Adv Excel', 'Adv Word', 'Adv PowerPoint', 'Access']
    },
    {
        title: 'English Typing',
        category: 'typing',
        duration: '1-2',
        level: 'Beginner',
        fees: '2,500',
        description: 'Improve your English typing speed and accuracy.',
        introduction: 'Speed and accuracy are key.',
        about: 'Touch-typing methods.',
        objectives: ['Finger placement.', 'Speed 30-40+ WPM.', 'Accuracy 95%+.'],
        outcomes: ['Touch typing.', 'Productivity.', 'Govt jobs.'],
        modules: ['Keyboard Layout', 'Rows Practice', 'Speed Building']
    },
    {
        title: 'Marathi Typing',
        category: 'typing',
        duration: '1-2',
        level: 'Beginner',
        fees: '2,500',
        description: 'Learn Marathi typing with Mangal and Krutidev fonts.',
        introduction: 'Regional language typing.',
        about: 'Covers ISM V6, Krutidev and Mangal.',
        objectives: ['Marathi layouts.', 'Conjuncts.', 'Speed & Accuracy.'],
        outcomes: ['Official documents.', 'Govt jobs.', 'Media work.'],
        modules: ['Intro', 'Vowels/Consonants', 'Conjuncts', 'Speed Tests']
    },
    {
        title: 'Web Development',
        category: 'computer',
        duration: '6',
        level: 'Advanced',
        fees: '15,000',
        description: 'Learn to build modern websites with HTML, CSS, JS, and React.',
        introduction: 'Launch your career as a developer.',
        about: 'Project-based course.',
        objectives: ['Client-Server.', 'Responsive layouts.', 'JS interactivity.', 'React.js.', 'Git.'],
        outcomes: ['Portfolio.', 'Responsive sites.', 'JS logic.', 'Frontend roles.'],
        modules: ['HTML5', 'CSS3', 'JS', 'React', 'Git', 'Project']
    },
    {
        title: 'Tally with GST',
        category: 'computer',
        duration: '3',
        level: 'Intermediate',
        fees: '6,000',
        description: 'Master Tally ERP 9 with GST.',
        introduction: 'Industry standard for accounting.',
        about: 'Manage business accounts professionally.',
        objectives: ['Interface.', 'Accounts.', 'Inventory.', 'Payroll.', 'GST.'],
        outcomes: ['Books of accounts.', 'GST filing.', 'Inventory mgmt.'],
        modules: ['Fundamentals', 'Company', 'Vouchers', 'Inventory', 'GST', 'Payroll']
    },
    {
        title: 'Graphic Design',
        category: 'computer',
        duration: '4',
        level: 'Intermediate',
        fees: '10,000',
        description: 'Learn Photoshop, CorelDRAW, and Illustrator.',
        introduction: 'Unleash creativity.',
        about: 'Design theory + software.',
        objectives: ['Photoshop.', 'CorelDRAW/Illustrator.', 'Color theory.', 'Print media.'],
        outcomes: ['Portfolio.', 'Design software.', 'Freelancing.'],
        modules: ['Theory', 'Photoshop', 'CorelDRAW', 'Illustrator', 'Project']
    },
    {
        title: 'Programming (C, C++, Java)',
        category: 'computer',
        duration: '6',
        level: 'Advanced',
        fees: '12,000',
        description: 'Learn programming fundamentals and OOP.',
        introduction: 'Build solid foundation.',
        about: 'C for structure, C++/Java for OOP.',
        objectives: ['Logic.', 'Structured programming.', 'OOP.', 'Data Structures.'],
        outcomes: ['Analytical skills.', '3 languages.', 'Interview prep.'],
        modules: ['C', 'C++', 'Java', 'DSA Basics', 'Mini Projects']
    }
];

const facultyData = [
    {
        name: 'Rajesh Patil',
        position: 'Senior Instructor',
        qualification: 'MCA, B.Ed',
        experience: '15',
        imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        courseTitles: ['Programming (C, C++, Java)', 'Web Development'] // Temp field for mapping
    },
    {
        name: 'Sneha Kulkarni',
        position: 'Tally Expert',
        qualification: 'M.Com, Tally Certified',
        experience: '10',
        imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        courseTitles: ['Tally with GST', 'Advanced MS Office']
    },
    {
        name: 'Amit Deshmukh',
        position: 'Typing Instructor',
        qualification: 'GCC-TBC Certified',
        experience: '8',
        imageUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
        courseTitles: ['English Typing', 'Marathi Typing', 'Basic Computer Course']
    },
    {
        name: 'Priya Joshi',
        position: 'Graphic Design Mentor',
        qualification: 'BFA (Applied Art)',
        experience: '6',
        imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        courseTitles: ['Graphic Design']
    }
];

const testimonialsData = [
    {
        name: 'Priya Sharma',
        courseTitle: 'Web Development', // Temp field
        rating: 5,
        review: 'Excellent teaching methods.',
        result: 'Placed at TCS'
    },
    {
        name: 'Rahul Patil',
        courseTitle: 'Tally with GST',
        rating: 5,
        review: 'Best institute for Tally.',
        result: 'Accountant'
    },
    {
        name: 'Sneha Desai',
        courseTitle: 'English Typing',
        rating: 4,
        review: 'Speed improved massively.',
        result: 'Cleared Exam'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Course.deleteMany({});
        await Faculty.deleteMany({});
        await Testimonial.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create Courses first
        const createdCourses = await Course.insertMany(coursesData);
        console.log(`Seeded ${createdCourses.length} courses.`);

        // Helper to find course ID by title
        const findCourseId = (title) => {
            const course = createdCourses.find(c => c.title === title);
            return course ? course._id : null;
        };

        // 2. Prepare and Create Faculty
        const facultyDocs = facultyData.map(fac => {
            const courseIds = fac.courseTitles.map(title => findCourseId(title)).filter(id => id);
            return {
                ...fac,
                courses: courseIds
            };
        });
        const createdFaculty = await Faculty.insertMany(facultyDocs);
        console.log(`Seeded ${createdFaculty.length} faculty members.`);

        // 3. Update Courses with Faculty IDs (Bi-directional sync)
        for (const faculty of createdFaculty) {
            for (const courseId of faculty.courses) {
                await Course.findByIdAndUpdate(courseId, {
                    $addToSet: { instructors: faculty._id }
                });
            }
        }
        console.log('Updated courses with instructor references.');

        // 4. Create Testimonials (Just for display, linking optional but good practice)
        // Note: functionality mainly uses string name for display, avoiding complex ref for now unless needed
        const testimonialDocs = testimonialsData.map(t => ({
            ...t,
            course: t.courseTitle // Keep string or link if you changed testimonial model (keeping string for now based on prev file)
        }));
        await Testimonial.insertMany(testimonialDocs);
        console.log(`Seeded ${testimonialDocs.length} testimonials.`);

        console.log('Database seeding & relational linking completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
