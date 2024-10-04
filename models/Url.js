const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortCode: { type: String, unique: true },
    totalVisits: { type: Number, default: 0 }, // Make sure this field exists
    uniqueVisitors: [String], // Consider changing this to an array of strings if using IPs directly
    deviceTypeBreakdown: [{ device: String, count: Number }],
    timeSeriesData: [{ _id: String, count: Number }],
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Url', urlSchema);
