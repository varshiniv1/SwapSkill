const router = require('express').Router();
const SwapRequest = require('../models/SwapRequest');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all swaps involving current user
router.get('/', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ requester: req.user._id }, { listingOwner: req.user._id }]
    })
      .populate('requester', 'name avatar rating')
      .populate('listingOwner', 'name avatar rating')
      .populate('listing', 'title offerSkill')
      .sort({ updatedAt: -1 });
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a swap request
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, requesterOffer, message, agreedDeadline } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive)
      return res.status(404).json({ message: 'Listing not found or inactive' });

    if (listing.user.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot swap with yourself' });

    const existing = await SwapRequest.findOne({
      listing: listingId,
      requester: req.user._id,
      status: { $in: ['pending', 'accepted', 'countered'] }
    });
    if (existing) return res.status(409).json({ message: 'You already have an active request on this listing' });

    const swap = await SwapRequest.create({
      listing: listingId,
      requester: req.user._id,
      listingOwner: listing.user,
      requesterOffer,
      message,
      agreedDeadline: agreedDeadline || undefined
    });

    await swap.populate([
      { path: 'requester', select: 'name avatar' },
      { path: 'listingOwner', select: 'name avatar' },
      { path: 'listing', select: 'title offerSkill' }
    ]);

    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept / counter / decline
router.put('/:id/respond', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.listingOwner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (swap.status !== 'pending' && swap.status !== 'countered')
      return res.status(400).json({ message: 'Cannot respond to this swap' });

    const { action, counterMessage, agreedScope, agreedDeadline } = req.body;
    if (!['accepted', 'countered', 'declined'].includes(action))
      return res.status(400).json({ message: 'Invalid action' });

    swap.status = action;
    if (action === 'countered') swap.counterMessage = counterMessage || '';
    if (action === 'accepted') {
      swap.agreedScope = agreedScope || '';
      if (agreedDeadline) swap.agreedDeadline = agreedDeadline;
    }

    await swap.save();
    res.json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark your side as done
router.put('/:id/done', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.status !== 'accepted')
      return res.status(400).json({ message: 'Swap must be accepted first' });

    const uid = req.user._id.toString();
    if (swap.requester.toString() === uid) swap.requesterDone = true;
    else if (swap.listingOwner.toString() === uid) swap.ownerDone = true;
    else return res.status(403).json({ message: 'Not authorized' });

    if (swap.requesterDone && swap.ownerDone) swap.status = 'completed';

    await swap.save();
    res.json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel (requester only, while pending)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.requester.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (!['pending', 'countered'].includes(swap.status))
      return res.status(400).json({ message: 'Cannot cancel at this stage' });

    swap.status = 'cancelled';
    await swap.save();
    res.json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit a review after completion
router.post('/:id/review', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.status !== 'completed')
      return res.status(400).json({ message: 'Swap must be completed' });

    const uid = req.user._id.toString();
    let revieweeId;
    if (swap.requester.toString() === uid) revieweeId = swap.listingOwner;
    else if (swap.listingOwner.toString() === uid) revieweeId = swap.requester;
    else return res.status(403).json({ message: 'Not part of this swap' });

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be 1-5' });

    const review = await Review.create({
      swap: swap._id,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment
    });

    // Update reviewee's average rating
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(revieweeId, { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already reviewed this swap' });
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a user
router.get('/reviews/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
