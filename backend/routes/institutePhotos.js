const express = require('express');
const router = express.Router();
const InstitutePhoto = require('../models/InstitutePhoto');

// @route   GET /api/institute-photos
// @desc    Get all institute photos
// @access  Public
router.get('/', async (req, res) => {
    try {
        const photos = await InstitutePhoto.find().sort({ order: 1 });
        res.json(photos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/institute-photos
// @desc    Add a new institute photo
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        // Get the highest order to append to the end
        const lastPhoto = await InstitutePhoto.findOne().sort({ order: -1 });
        const newOrder = lastPhoto ? lastPhoto.order + 1 : 0;

        const newPhoto = new InstitutePhoto({
            imageUrl,
            order: newOrder
        });

        const photo = await newPhoto.save();
        res.json(photo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/institute-photos/:id
// @desc    Delete an institute photo
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const photo = await InstitutePhoto.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ msg: 'Photo not found' });
        }

        await photo.deleteOne();
        res.json({ msg: 'Photo removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Photo not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/institute-photos/reorder
// @desc    Batch reorder photos
// @access  Private (Admin)
router.put('/reorder', async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, order }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ msg: 'Invalid items array' });
        }

        // Use bulkWrite for efficient updates
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { order: item.order }
            }
        }));

        await InstitutePhoto.bulkWrite(bulkOps);

        const photos = await InstitutePhoto.find().sort({ order: 1 });
        res.json(photos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/institute-photos/:id/reorder
// @desc    Reorder a photo
// @access  Private (Admin)
router.put('/:id/reorder', async (req, res) => {
    try {
        const { direction } = req.body; // 'up' or 'down'
        const currentPhoto = await InstitutePhoto.findById(req.params.id);

        if (!currentPhoto) {
            return res.status(404).json({ msg: 'Photo not found' });
        }

        const currentOrder = currentPhoto.order;
        let swapPhoto;

        if (direction === 'up') {
            swapPhoto = await InstitutePhoto.findOne({ order: { $lt: currentOrder } }).sort({ order: -1 });
        } else if (direction === 'down') {
            swapPhoto = await InstitutePhoto.findOne({ order: { $gt: currentOrder } }).sort({ order: 1 });
        }

        if (swapPhoto) {
            // Swap orders
            const swapOrder = swapPhoto.order;
            swapPhoto.order = currentOrder;
            currentPhoto.order = swapOrder;

            await swapPhoto.save();
            await currentPhoto.save();
        }

        const photos = await InstitutePhoto.find().sort({ order: 1 });
        res.json(photos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
