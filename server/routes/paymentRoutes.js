const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const auth = require("../middleware/auth");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order route
router.post("/create-order", auth, async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  const options = {
    amount: amount * 100,
    currency,
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Unable to create order" });
  }
});

router.post("/verify-payment", auth, (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ msg: "Payment verified successfully ✅" });
  } else {
    res.status(400).json({ msg: "Invalid payment signature ❌" });
  }
});


module.exports = router;
