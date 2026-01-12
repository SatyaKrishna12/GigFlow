const express = require('express');
const { getGigs, createGig, getGigById, getMyGigs } = require('../controllers/gig');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET All Gigs
router.get('/', getGigs);

// Get current user's gigs
router.get('/my/all', protect, getMyGigs);

router.post('/', protect, createGig);

router.get('/:id', getGigById);

// GET /api/gigs/:id/bids - Protected (Owner only)
router.get('/:id/bids', protect, async (req, res, next) => {
  const { getBidsForGig } = require('../controllers/bid');
  req.params.gigId = req.params.id;
  getBidsForGig(req, res, next);
});

module.exports = router;
