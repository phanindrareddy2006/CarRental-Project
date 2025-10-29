import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ user }) {
  return (
    <div>
      {/* ==== Header ==== */}
      <header className="top-bar">
        <div className="logo">
          DreamCar <span className="subtitle">(Car Rental)</span>
        </div>
        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/ourcars">Our Cars</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/contact">Contact</Link>

          {!user ? (
            <>
              <Link className="nav-btn login-btn" to="/login">
                Login
              </Link>
              <Link className="nav-btn signup-btn" to="/signup">
                Signup
              </Link>
            </>
          ) : (
            <Link className="nav-btn profile-btn" to="/profile">
              {user.username || "Profile"}
            </Link>
          )}
        </nav>
      </header>

      {/* ==== Info bar ==== */}
      <div className="info-bar">
        <span>
          <i className="fa fa-map-marker"></i> 123 Main Road, City
        </span>
        <span>
          <i className="fa fa-phone"></i> +91-9876543210
        </span>
        <span>
          <i className="fa fa-envelope"></i> contact@dreamcar.com
        </span>
      </div>
    </div>
  );
}
