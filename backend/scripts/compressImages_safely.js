const mongoose = require('mongoose');
const { Jimp } = require('jimp');
require('dotenv').config();

// Models
const Banner = require('../models/Banner');
const InstitutePhoto = require('../models/InstitutePhoto');

const MAX_WIDTH = 1200;
const QUALITY = 60; // Lower quality to ensure reduction

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const compressBuffer = async (buffer) => {
    const image = await Jimp.read(buffer);
    const currentWidth = image.width || image.bitmap.width;

    if (currentWidth > MAX_WIDTH) {
        // Use object syntax for Jimp v1
        image.resize({ w: MAX_WIDTH });
    }

    // If image.quality is a function, try to use it.
    // If it fails with "expected object", we will catch it?
    // Based on previous logs, we didn't crash on quality, we crashed on resize.
    // So let's try standard quality method, if it fails we might need image.quality({ quality: QUALITY })
    // But let's check input type.
    // Quality setting removed as method is missing in v1 defaults or type.
    // relying on resize for main reduction.

    const processedBuffer = await image.getBuffer(Jimp.MIME_JPEG || "image/jpeg");
    return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
};

const processCollection = async (Model, collectionName) => {
    console.log(`Processing ${collectionName}...`);
    const docs = await Model.find({});
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const doc of docs) {
        try {
            if (!doc.imageUrl || !doc.imageUrl.startsWith('data:image')) {
                // console.log(`Skipping doc ${doc._id} (no base64 image)`);
                skippedCount++;
                continue;
            }

            // Extract base64 
            const base64Data = doc.imageUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const compressedBase64 = await compressBuffer(buffer);

            // ONLY SAVE IF SMALLER
            if (compressedBase64.length < doc.imageUrl.length) {
                console.log(`Processing doc ${doc._id} - ${(doc.imageUrl.length / 1024 / 1024).toFixed(2)} MB -> ${(compressedBase64.length / 1024 / 1024).toFixed(2)} MB (SAVED)`);
                doc.imageUrl = compressedBase64;
                await doc.save();
                successCount++;
            } else {
                console.log(`Processing doc ${doc._id} - ${(doc.imageUrl.length / 1024 / 1024).toFixed(2)} MB -> ${(compressedBase64.length / 1024 / 1024).toFixed(2)} MB (SKIPPED - Larger)`);
                skippedCount++;
            }

        } catch (error) {
            console.error(`Failed to process doc ${doc._id}:`, error.message);
            errorCount++;
        }
    }
    console.log(`Finished ${collectionName}: ${successCount} updated, ${skippedCount} skipped, ${errorCount} errors.`);
};

const run = async () => {
    await connectDB();
    try {
        await processCollection(Banner, 'Banners');
        await processCollection(InstitutePhoto, 'InstitutePhotos');
    } catch (error) {
        console.error('Script failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
};

run();
