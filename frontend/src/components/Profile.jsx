import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Prevent crash if user is null
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8118/api/bookings/user/${user.username}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  // ✅ Render nothing until user is confirmed
  if (!user) return null;

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div>
      <section className="profile-section">
        <h2>Welcome, {user.username}!</h2>
        <p>Your account details and rental history will appear here.</p>

        <div className="profile-details">
          <h3>Account Details:</h3>
          <div className="account-form">
            <div className="form-group">
              <label>Username:</label>
              <input type="text" value={user.username} readOnly />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input type="text" value={user.role} readOnly />
            </div>
          </div>
        </div>

        <div className="booking-history">
          <h3>Your Bookings:</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Car ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Days</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, index) => (
                    <tr key={b.id ?? index}>
                      <td>{b.id}</td>
                      <td>{b.carId}</td>
                      <td>{b.startDate}</td>
                      <td>{b.endDate}</td>
                      <td>{b.totalDays}</td>
                      <td>₹{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </div>
  );
}
