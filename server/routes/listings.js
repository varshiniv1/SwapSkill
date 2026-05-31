const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.offerCategory = category;
    if (search) {
      filter.$or = [
        { offerSkill: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { wantSkills: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('user', 'name avatar rating reviewCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Listing.countDocuments(filter)
    ]);

    res.json({ listings, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'name avatar rating reviewCount bio');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/',
  auth,
  [
    body('title').trim().notEmpty(),
    body('offerSkill').trim().notEmpty(),
    body('offerCategory').notEmpty(),
    body('offerLevel').isIn(['beginner', 'mid', 'expert']),
    body('wantSkills').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const listing = await Listing.create({ ...req.body, user: req.user._id });
      res.status(201).json(listing);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await listing.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
