const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url' },
  userAgent: String,
  ip: String,
  referrer: String, // For tracking referrer
  timestamp: { type: Date, default: Date.now },
  deviceType: String
});

module.exports = mongoose.model('Visit', visitSchema);
