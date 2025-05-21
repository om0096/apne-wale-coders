import React from "react";
import { useNavigate } from "react-router-dom";
import "./Step5Confirmation.css";

const Step5Confirmation = ({ bookingDetails }) => {
  const navigate = useNavigate();

  if (!bookingDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-icon">✓</div>
      <div className="confirmation-message">Booking Confirmed!</div>
      <div>Thankyou for booking with Apne Wale Coders. We've sent a confirmation email to {bookingDetails.email} with all the details.</div>
      <p></p>
      <div className="confirmation-details">
        <div className="confirmation-row"><span>Service:</span><span>{bookingDetails.service}</span></div>
        <div className="confirmation-row"><span>Date:</span><span>{bookingDetails.date}</span></div>
        <div className="confirmation-row"><span>Time:</span><span>{bookingDetails.time}</span></div>
        <div className="confirmation-row"><span>Name:</span><span>{bookingDetails.fullName}</span></div>
        <div className="confirmation-row"><span>Email:</span><span>{bookingDetails.email}</span></div>
        <div className="confirmation-row"><span>Booking ID:</span><span>{bookingDetails._id}</span></div>
      </div>
      <button
        className="confirmation-btn"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Step5Confirmation;
