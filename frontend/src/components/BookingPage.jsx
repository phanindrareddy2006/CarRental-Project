import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingPage.css";

export default function BookingPage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const carFromState = location.state?.car;
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  // ✅ Toast helper
  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3500);
  };

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Fetch car details
  useEffect(() => {
    if (carFromState) {
      const priceRaw = parseFloat(carFromState.price?.toString().replace(/\₹/g, "")) || 0;
      setCar({ ...carFromState, priceRaw, priceDisplay: `₹${priceRaw}` });
    } else {
      fetch(`https://carrental-project-8862.onrender.com/api/cars/1`)
        .then((res) => res.json())
        .then((data) => {
          const priceRaw = parseFloat(data.price?.toString().replace(/\₹/g, "")) || 0;
          setCar({ ...data, priceRaw, priceDisplay: `₹${priceRaw}` });
        })
        .catch(() => showToast("Failed to fetch car details.", "error"));
    }
  }, [carFromState]);

  // ✅ Calculate total days & amount
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const days = diffDays > 0 ? diffDays : 0;
      setTotalDays(days);
      setTotalAmount(days > 0 ? parseFloat((days * car.priceRaw).toFixed(2)) : 0);
    }
  }, [startDate, endDate, car]);

  // ✅ Payment flow
  const handlePayment = async () => {
    if (!startDate || !endDate) {
      showToast("Please select start and end date", "warning");
      return;
    }
    if (!user) {
      showToast("Please login first", "warning");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await fetch("https://carrental-project-8862.onrender.com/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount,
          username: user.username,
          carId: car.id,
          currency: "INR",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DreamCar Rentals",
        description: `Booking for ${car.name}`,
        order_id: orderData.orderId,
        prefill: { name: user.username, email: user.email || "" },
        theme: { color: "#0a9396" },

        handler: async (response) => {
          try {
            const verifyRes = await fetch("https://carrental-project-8862.onrender.com/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              const bookingData = {
                username: user.username,
                carId: car.id,
                startDate,
                endDate,
                totalDays,
                totalAmount,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              };

              const bookingRes = await fetch("https://carrental-project-8862.onrender.com/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
              });

              if (bookingRes.ok) {
                showToast("✅ Booking successful!", "success");
                // ✅ Delay redirect slightly so toast is visible
                setTimeout(() => {
                  navigate("/ourcars", { state: { toastMessage: "✅ Booking successful!" } });
                }, 1000);
              } else {
                showToast("Payment succeeded but booking failed.", "error");
              }
            } else {
              showToast("Payment verification failed.", "error");
            }
          } catch {
            showToast("Error verifying payment.", "error");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        showToast(`❌ Booking failed: ${resp.error.description}`, "error");
      });
      rzp.open();
    } catch {
      showToast("Unable to initiate payment", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!car)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div className="booking-page">
      <h2>Book Your Ride</h2>
      <div className="booking-card page-section">
        <div className="car-image-container">
          <img src={car.imageUrl || car.image} alt={car.name} className="booking-car-image" />
        </div>

        <div className="booking-car-info">
          <h3>{car.name}</h3>
          <p><strong>Type:</strong> {car.type}</p>
          <p><strong>Price per day:</strong> {car.priceDisplay}</p>
          <p><strong>Description:</strong> {car.description}</p>
        </div>

        <div className="booking-form">
          <div className="dates-row">
            <div className="date-item">
              <label>Start Date:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="date-item">
              <label>End Date:</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="summary-row">
            <div className="summary-item">
              <p><strong>Total Days:</strong></p>
              <p>{totalDays}</p>
            </div>
            <div className="summary-item">
              <p><strong>Total Amount:</strong></p>
              <p>₹{totalAmount}</p>
            </div>
          </div>

          <button className="btn-primary" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay & Book"}
          </button>
        </div>
      </div>

      {/* ✅ Toast Notification */}
      {toast.visible && (
        <div className={`toast-bubble ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
