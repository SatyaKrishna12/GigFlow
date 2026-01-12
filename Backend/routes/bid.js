const express = require('express');
const { createBid, getBidsForGig, hireBid, getMyBids } = require('../controllers/bid');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get current user's bids
router.get('/my/all', protect, getMyBids);

router.post('/', protect, createBid);

router.get('/:gigId', protect, getBidsForGig);

router.patch('/:bidId/hire', protect, hireBid);

module.exports = router;
