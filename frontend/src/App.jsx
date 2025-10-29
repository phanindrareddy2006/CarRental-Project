import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast"; // ✅ add this import

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import OurCars from "./components/OurCars.jsx";
import Pricing from "./components/Pricing.jsx";
import Contact from "./components/Contact.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Profile from "./components/Profile.jsx";
import BookingPage from "./components/BookingPage.jsx";

// attach token at module load if present (ensures axios has header for first render)
const initialToken = localStorage.getItem("token");
if (initialToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, []);

  const handleLoginSuccess = (userData) => {
    const normalizedUser = userData?.user ? userData.user : userData;
    setUser(normalizedUser);

    const token = userData?.token || (userData?.user && userData.user.token) || null;
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } catch (e) {
      console.error("Failed to store user to localStorage:", e);
    }

    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/ourcars" element={<OurCars user={user} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup onSuccess={handleLoginSuccess} />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
          <Route path="/booking" element={<BookingPage user={user} />} />
        </Routes>
      </main>

      <Footer />

      {/* ✅ Add Toaster here */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 8000,
        }}
      />
    </>
  );
}

export default App;
