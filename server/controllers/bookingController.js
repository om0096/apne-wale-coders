const Booking = require('../models/booking');
const sendBookingConfirmation = require('../utils/sendEmail');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const confirmBooking = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingData } = req.body;

  try {
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ msg: 'Payment verification failed' });
    }

    const newBooking = await Booking.create({
      ...bookingData,
      userId: req.userId,
      paymentId: razorpay_payment_id,
      paymentStatus: "confirmed",
    });

    const bookingDetails = `
      Service: ${newBooking.service}
      Date: ${newBooking.date}
      Time: ${newBooking.time}
      Booking ID: ${newBooking._id}
    `;

    await sendBookingConfirmation(newBooking.email, bookingDetails);

    res.status(201).json({msg: 'Booking confirmed and email sent', booking: newBooking});
  } catch (err) {
    console.error("Error confirming booking", err);
    res.status(500).json({ msg: 'Error confirming booking', error: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      service,
      fullName,
      email,
      phone,
      resumeLink,
      targetRole,
      notes,
      date,
      timeSlot
    } = req.body;

    const newBooking = new Booking({
      userId: req.userId,
      service,
      fullName,
      email,
      phone,
      resumeLink,
      targetRole,
      notes,
      date,
      time: timeSlot,
      paymentId: null,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created (not paid yet)', booking: newBooking });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  confirmBooking,
  createBooking,
  getUserBookings
};
