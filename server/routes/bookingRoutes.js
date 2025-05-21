const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  confirmBooking
} = require('../controllers/bookingController');

router.post('/create', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.post('/confirm', auth, confirmBooking);

router.get("/booked-slots", auth, async (req, res) => {
  const { date } = req.query;

  try {
    const bookings = await Booking.find({
      date,
      userId: req.userId,
      paymentStatus: "confirmed",
    });

    const bookedTimes = bookings.map(b => b.time);
    res.json({ bookedTimes });
  } catch (err) {
    res.status(500).json({ error: "Error fetching booked slots" });
  }
});


module.exports = router;
