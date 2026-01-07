const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// Get all banners (sorted by order)
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1 });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new banner
router.post('/', async (req, res) => {
    try {
        // Get the highest order number and add 1
        const maxOrderBanner = await Banner.findOne().sort({ order: -1 });
        const newOrder = maxOrderBanner ? maxOrderBanner.order + 1 : 0;

        const banner = new Banner({
            ...req.body,
            order: newOrder
        });

        const newBanner = await banner.save();
        res.status(201).json(newBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Batch reorder banners
router.put('/reorder', async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, order }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items array' });
        }

        // Use bulkWrite for efficient updates
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { order: item.order }
            }
        }));

        await Banner.bulkWrite(bulkOps);

        // Return all banners sorted
        const banners = await Banner.find().sort({ order: 1 });
        res.json(banners);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a banner
router.put('/:id', async (req, res) => {
    try {
        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Batch reorder banners
router.put('/reorder', async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, order }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items array' });
        }

        // Use bulkWrite for efficient updates
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { order: item.order }
            }
        }));

        await Banner.bulkWrite(bulkOps);

        // Return all banners sorted
        const banners = await Banner.find().sort({ order: 1 });
        res.json(banners);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Single reorder (legacy/arrow support)
router.put('/:id/reorder', async (req, res) => {
    try {
        const { direction } = req.body; // 'up' or 'down'
        const currentBanner = await Banner.findById(req.params.id);

        if (!currentBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const currentOrder = currentBanner.order;
        let swapOrder;

        if (direction === 'up') {
            // Move up means decrease order (swap with previous)
            swapOrder = currentOrder - 1;
        } else if (direction === 'down') {
            // Move down means increase order (swap with next)
            swapOrder = currentOrder + 1;
        } else {
            return res.status(400).json({ message: 'Invalid direction' });
        }

        // Find the banner to swap with
        const swapBanner = await Banner.findOne({ order: swapOrder });

        if (!swapBanner) {
            // If no banner at swap position, just update current order (gap fixing)
            // Or try to find nearest neighbor? 
            // For now, let's just stick to exact swap logic as it works for dense lists
            return res.status(400).json({ message: 'Cannot move in that direction' });
        }

        // Swap orders
        currentBanner.order = swapOrder;
        swapBanner.order = currentOrder;

        await currentBanner.save();
        await swapBanner.save();

        // Return all banners sorted
        const banners = await Banner.find().sort({ order: 1 });
        res.json(banners);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a banner
router.delete('/:id', async (req, res) => {
    try {
        const bannerToDelete = await Banner.findById(req.params.id);

        if (!bannerToDelete) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const deletedOrder = bannerToDelete.order;

        // Delete the banner
        await Banner.findByIdAndDelete(req.params.id);

        // Reorder remaining banners (decrease order for all banners after deleted one)
        await Banner.updateMany(
            { order: { $gt: deletedOrder } },
            { $inc: { order: -1 } }
        );

        res.json({ message: 'Banner deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
