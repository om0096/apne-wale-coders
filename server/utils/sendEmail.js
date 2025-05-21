const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (to, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Booking Confirmation - Apne Wale Coders',
    text: `Thank you for booking your slot!\n\nHere are your booking details:\n${bookingDetails}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendBookingConfirmation;
