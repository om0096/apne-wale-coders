import React, { useState } from "react";
import api from '../api';
import Step5Confirmation from "../components/Step5Confirmation";
import Stepper from "../components/Stepper";
import { useEffect } from "react";
import './BookSlot.css';

const BookSlot = () => {
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    fullName: "",
    email: "",
    phone: "",
    resumeLink: "",
    targetRole: "",
    notes: "",
    date: "",
    time: "",
    agree: false,
  });
  const [bookedTimes, setBookedTimes] = useState([]);
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (formData.date) {
      const token = localStorage.getItem("token");

      api
        .get(`/booking/booked-slots?date=${formData.date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBookedTimes(res.data.bookedTimes);
        })
        .catch((err) => {
          console.error("Failed to fetch booked times", err);
        });
    }
  }, [formData.date]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const time = new Date();
      time.setHours(hour, 0, 0);
      const formatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      slots.push(formatted);
    }
    return slots;
  };


  const handlePayment = async () => {
    try {
      const { data } = await api.post("/payment/create-order", {
        amount: 999,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Apne Wale Coders",
        description: "Slot Booking Payment",
        order_id: data.id,
        handler: async function (response) {
          try {
            await api.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const saveRes = await api.post("/booking/confirm", {
              bookingData: formData,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            setConfirmedBooking(saveRes.data.booking);
            setStep(6);

          } catch (err) {
            console.error("Payment verification or save failed:", err);
            alert("Something went wrong during payment confirmation.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#EF4444",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Payment Failed");
    }
  };

  return (
    <div className="bookslot-container">
      <Stepper currentStep={step} className="bookslot-stepper" />

      {step === 1 && (
        <div>
          <label className="bookslot-label" htmlFor="service">Desired Service</label>
          <input
            id="service"
            type="text"
            name="service"
            value={formData.service}
            onChange={handleChange}
            placeholder="e.g., Resume Review, Interview Prep"
            className="bookslot-input"
          />
          <div className="bookslot-btn-group" style={{ justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              disabled={!formData.service.trim()}
              className="bookslot-btn bookslot-btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="info-title">Your Information</h2>
          <label className="bookslot-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="bookslot-input"
          />

          <label className="bookslot-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bookslot-input"
          />

          <label className="bookslot-label" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bookslot-input"
          />

          <label className="bookslot-label" htmlFor="resumeLink">Resume Link ( if any )</label>
          <input
            id="resumeLink"
            type="url"
            name="resumeLink"
            value={formData.resumeLink}
            onChange={handleChange}
            className="bookslot-input"
            placeholder="Google Drive or Dropbox link"
          />

          <label className="bookslot-label" htmlFor="targetRole">Target Role</label>
          <input
            id="targetRole"
            type="text"
            name="targetRole"
            value={formData.targetRole}
            onChange={handleChange}
            className="bookslot-input"
          />

          <label className="bookslot-label" htmlFor="notes"> Additional Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="bookslot-textarea"
            placeholder="Additional info or questions..."
          />

          <div className="bookslot-btn-group">
            <button
              onClick={handleBack}
              className="bookslot-btn bookslot-btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={
                !formData.fullName ||
                !formData.email ||
                !formData.phone ||
                !formData.targetRole
              }
              className="bookslot-btn bookslot-btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="info-title">Date & Time</h2>

          <div className="calendar-time-container">
            <div className="calendar-section">
              <label className="bookslot-label" htmlFor="date">Select Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="bookslot-input"
              />
            </div>
            <div className="time-section">
              <label className="bookslot-label">Select Time Slot</label>
              <div className="time-slots">
                {generateTimeSlots().map((slot) => {
                  const isBooked = bookedTimes.includes(slot);
                  const isSelected = formData.time === slot;

                  return (
                    <button
                      key={slot}
                      className={`time-slot-btn ${
                        isBooked ? "booked" : isSelected ? "selected" : ""
                      }`}
                      disabled={isBooked}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, time: slot }))
                      }
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bookslot-btn-group">
            <button
              onClick={handleBack}
              className="bookslot-btn bookslot-btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.date || !formData.time}
              className="bookslot-btn bookslot-btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2 className="info-title">Booking Summary & Payment</h2>
          <div className="bookslot-summary">
            <div className="bookslot-summary-row">
              <span><strong>Service:</strong></span>
              <span>{formData.service}</span>
            </div>
            <div className="bookslot-summary-row">
              <span><strong>Date:</strong></span>
              <span>{formData.date}</span>
            </div>
            <div className="bookslot-summary-row">
              <span><strong>Time:</strong></span>
              <span>{formData.time}</span>
            </div>
            <div className="bookslot-summary-row">
              <span><strong>Name:</strong></span>
              <span>{formData.fullName}</span>
            </div>
            <div className="bookslot-summary-row">
              <span><strong>Email:</strong></span>
              <span>{formData.email}</span>
            </div>
            <div className="bookslot-summary-row">
              <span><strong>Phone:</strong></span>
              <span>{formData.phone}</span>
            </div>

            <div className="bookslot-summary-separator"></div>

            <div className="bookslot-summary-total">
              <span>Total Amount:</span>
              <span className="bookslot-summary-price">₹999</span>
            </div>
          </div>

          <div className="bookslot-checkbox-container">
            <input
              type="checkbox"
              id="tnc"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="bookslot-checkbox"
            />
            <label htmlFor="tnc">
              I agree to the{" "}
              <span
                onClick={() => alert("This is the Terms & Conditions tab")}
                className="bookslot-terms-link"
                style={{ color: "#ef4444", cursor: "pointer", textDecoration: "underline" }}
              >
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span
                onClick={() => alert("This is the Privacy Policy tab")}
                className="bookslot-terms-link"
                style={{ color: "#ef4444", cursor: "pointer", textDecoration: "underline" }}
              >
                Privacy Policy
              </span>
            </label>
          </div>

          <div className="bookslot-btn-group">
            <button
              onClick={handleBack}
              className="bookslot-btn bookslot-btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={!formData.agree}
              className="bookslot-btn bookslot-btn-primary"
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      )}

      {(step === 5 || step === 6) && (
        <Step5Confirmation bookingDetails={confirmedBooking} />
      )}

    </div>
  );
};

export default BookSlot;
