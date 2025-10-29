import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ==== Main Section ==== */}
      <main className="main-section">
        <section className="left-section">
          <h1>
            <span>Your Journey,</span>
            <br />
            <span className="brand-main">Our Wheels</span>
          </h1>
          <p>
            Experience smooth, affordable, and reliable car rentals with DreamCar.
            Whether for a weekend getaway, a business trip, or city rides,
            choose from a wide range of well-maintained vehicles.
            <b> Book in minutes. Drive with confidence.</b>
          </p>
          <div className="button-group">
            <button
              className="btn primary"
              onClick={() => navigate("/ourcars")}
            >
              Reserve Now
            </button>
            <button
              className="btn secondary"
              onClick={() => navigate("/ourcars")}
            >
              View Fleet
            </button>
          </div>
        </section>
        <section className="right-section">
          <img src="/assets/bmw.png" alt="Car for rent" className="main-jeep" />
        </section>
      </main>
    </div>
  );
}
