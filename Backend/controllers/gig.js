const Gig = require('../models/Gig');

// @desc    Get all open gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Build query
    let query = { status: 'open' };
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch gigs and populate owner info
    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gigs',
      error: error.message
    });
  }
};

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Protected
const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Validate required fields
    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and budget'
      });
    }

    // Validate budget is a positive number
    if (budget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a positive number'
      });
    }

    // Create gig with ownerId from authenticated user
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    // Populate owner info before sending response
    await gig.populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig
    });
  } catch (error) {
    console.error('Create gig error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating gig'
    });
  }
};

// @desc    Get a single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id)
      .populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      gig: {
        _id: gig._id,
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        status: gig.status,
        owner: {
          _id: gig.ownerId._id,
          name: gig.ownerId.name,
          email: gig.ownerId.email
        },
        createdAt: gig.createdAt,
        updatedAt: gig.updatedAt
      }
    });
  } catch (error) {
    console.error('Get gig by ID error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gig ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching gig'
    });
  }
};

// @desc    Get current user's gigs (all statuses)
// @route   GET /api/gigs/my/all
// @access  Protected
const getMyGigs = async (req, res) => {
  try {
    // Fetch all gigs owned by the current user
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    console.error('Get my gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your gigs',
      error: error.message
    });
  }
};

module.exports = {
  getGigs,
  createGig,
  getGigById,
  getMyGigs
};
