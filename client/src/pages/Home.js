import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleBookSlot = () => {
    navigate("/book-slot");
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Apne Wale Coders</h1>
      
      <button onClick={handleBookSlot} className="home-book-btn">
        Book Your Slot
      </button>
    </div>
  );
};

export default Home;
