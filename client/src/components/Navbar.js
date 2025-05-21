import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const showAlert = (label) => {
    alert(`This is ${label} tab`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Apne Wale Coders</div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/book-slot">Book Slot</Link>
        <span onClick={() => showAlert("About Us")} className="dummy-link">About Us</span>
        <span onClick={() => showAlert("Services")} className="dummy-link">Services</span>
        <span onClick={() => showAlert("Blogs")} className="dummy-link">Blogs</span>
        <span onClick={() => showAlert("Jobs")} className="dummy-link">Jobs</span>
        <span onClick={() => showAlert("Study Material")} className="dummy-link">Study Material</span>
      </div>

      <div className="navbar-actions">
        <Link to="/dashboard" className="dashboard-btn">Dashboard</Link>
        <span onClick={() => showAlert("Post Job")} className="postjob-btn">Post Job</span>
        <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
