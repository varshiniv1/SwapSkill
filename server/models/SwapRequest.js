const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  requesterOffer: { type: String, required: true },
  message: { type: String, default: '', maxlength: 500 },
  agreedScope: { type: String, default: '' },
  agreedDeadline: { type: Date },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'countered', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },

  counterMessage: { type: String, default: '' },

  requesterDone: { type: Boolean, default: false },
  ownerDone: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

swapRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
