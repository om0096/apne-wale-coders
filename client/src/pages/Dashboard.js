import React, { useEffect, useState } from "react";
import api from "../api";
import "./Dashboard.css";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/booking/my-bookings");
        setBookings(data.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Status:</strong> Confirmed</p>
              <p><strong>Booking ID:</strong> {booking._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
