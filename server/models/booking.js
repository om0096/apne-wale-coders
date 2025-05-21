const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service: String,
  fullName: String,
  email: String,
  phone: String,
  resumeLink: String,
  targetRole: String,
  notes: String,
  date: String,
  time: String,
  paymentStatus: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
