const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

console.log('Attempting to connect...');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        const msg = 'SUCCESS: Connected to MongoDB';
        console.log(msg);
        fs.writeFileSync('debug_output.txt', msg);
        process.exit(0);
    })
    .catch(err => {
        const msg = `ERROR: ${err.message}\nCode: ${err.code}\nName: ${err.name}`;
        console.error(msg);
        fs.writeFileSync('debug_output.txt', msg);
        process.exit(1);
    });
