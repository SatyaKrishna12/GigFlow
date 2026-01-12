const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { emitToUser } = require('../socket');
const mongoose = require('mongoose');


const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Validate required fields
    if (!gigId || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide gigId and price'
      });
    }

    // Validate price is positive
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Prevent bidding on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids'
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    // Populate freelancer info
    await bid.populate('freelancerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    
    // Handle duplicate bid error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gig ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating bid'
    });
  }
};


const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Verify user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can view bids'
      });
    }

    // Fetch all bids for the gig
    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    console.error('Get bids error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid gig ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching bids'
    });
  }
};


const hireBid = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  
  try {
    // Start a transaction
    session.startTransaction();

    const { bidId } = req.params;

    // Find the bid within the transaction
    const bid = await Bid.findById(bidId)
      .populate('gigId')
      .session(session);
    
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Check if gig exists
    const gig = bid.gigId;
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Associated gig not found'
      });
    }

    // Verify user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can hire freelancers'
      });
    }

    // findOneAndUpdate with atomic check-and-set to prevent race conditions
    const updatedGig = await Gig.findOneAndUpdate(
      {
        _id: gig._id,
        status: 'open' // Only update if status is still 'open'
      },
      {
        status: 'assigned',
        hiredFreelancerId: bid.freelancerId,
        hiredBidId: bidId
      },
      {
        new: false, // Return the document BEFORE update to verify the operation succeeded
        session // Include in transaction
      }
    );

    // If updatedGig is null, it means the gig was already assigned by another concurrent request
    if (!updatedGig) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned to another freelancer'
      });
    }

    // Now that we've atomically locked the gig, proceed with updates
    // 1. Set selected bid status to "hired"
    bid.status = 'hired';
    await bid.save({ session });

    // 2. Set all other bids for the same gig to "rejected"
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bidId }
      },
      {
        status: 'rejected'
      },
      { session }
    );

    // Commit the transaction - all changes happen atomically
    await session.commitTransaction();

    // Populate freelancer info before sending response (outside transaction)
    await bid.populate('freelancerId', 'name email');

    // 3. Send real-time notification to the hired freelancer
    emitToUser(bid.freelancerId._id, 'hired', {
      message: `You have been hired for ${gig.title}!`,
      gigTitle: gig.title,
      gigId: gig._id,
      bidId: bid._id,
      timestamp: new Date()
    });

    // 4. Notify rejected freelancers
    const rejectedBids = await Bid.find({
      gigId: gig._id,
      _id: { $ne: bidId },
      status: 'rejected'
    }).populate('freelancerId', 'name email');

    rejectedBids.forEach((rejectedBid) => {
      emitToUser(rejectedBid.freelancerId._id, 'bid-rejected', {
        message: `Your bid for "${gig.title}" was not selected`,
        gigTitle: gig.title,
        gigId: gig._id,
        bidId: rejectedBid._id,
        timestamp: new Date()
      });
    });

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      bid
    });
  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    
    console.error('Hire bid error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid bid ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while hiring freelancer'
    });
  } finally {
    // End the session
    session.endSession();
  }
};


const getMyBids = async (req, res) => {
  try {
    // Fetch all bids submitted by the current user
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('freelancerId', 'name email')
      .populate({
        path: 'gigId',
        populate: {
          path: 'ownerId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your bids',
      error: error.message
    });
  }
};

module.exports = {
  createBid,
  getBidsForGig,
  hireBid,
  getMyBids
};
