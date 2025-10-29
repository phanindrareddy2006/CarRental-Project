import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8118/api/auth/signup", inputs);

      setIsError(false);
      setMessage("Signup successful! Redirecting to login...");
      setIsRedirecting(true);

      setInputs({
        username: "",
        email: "",
        password: "",
        role: "customer",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setIsError(true);
      const errMsg = err.response?.data?.message || "Signup error";
      setMessage(errMsg);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input
          name="username"
          value={inputs.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          name="email"
          value={inputs.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="password"
          value={inputs.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
        />
        <select name="role" value={inputs.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={isRedirecting}>
          {isRedirecting ? "Redirecting..." : "Sign Up"}
        </button>

        {message && (
          <div className={`signup-message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <p className="login-link">
          Already have an account? <Link to="/login">Login!</Link>
        </p>
      </form>
    </div>
  );
}
