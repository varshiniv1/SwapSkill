const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offerSkill: { type: String, required: true, trim: true },
  offerCategory: { type: String, required: true },
  offerLevel: { type: String, enum: ['beginner', 'mid', 'expert'], required: true },
  wantSkills: [{ type: String, required: true, trim: true }],
  wantCategories: [{ type: String }],
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: '', maxlength: 500 },
  timeEstimate: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

listingSchema.index({ offerCategory: 1, isActive: 1 });
listingSchema.index({ wantCategories: 1, isActive: 1 });

module.exports = mongoose.model('Listing', listingSchema);
