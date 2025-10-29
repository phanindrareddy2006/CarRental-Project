import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ onSuccess }) {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://carrental-project-8862.onrender.com/api/auth/login", inputs);
      const responseData = res.data;

      // Backend may return either:
      // 1) a token + user object: { token: "...", user: { ... } }
      // 2) or just a user object (no token)
      const token = responseData.token ?? responseData?.accessToken ?? null;
      const userObj = responseData.user ?? responseData;

      // persist
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      localStorage.setItem("user", JSON.stringify(userObj));

      // inform parent with normalized payload (pass both if token exists)
      const payload = token ? { user: userObj, token } : userObj;
      onSuccess(payload);

      setIsError(false);
      setMessage("Login successful! Redirecting...");
      setIsRedirecting(true);
      setInputs({ email: "", password: "" });

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      setIsError(true);
      setMessage(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input name="email" value={inputs.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="password" value={inputs.password} onChange={handleChange} placeholder="Password" type="password" required />
        <button type="submit" disabled={isRedirecting}>{isRedirecting ? "Redirecting..." : "Login"}</button>

        {message && <div className={`login-message ${isError ? "error" : "success"}`}>{message}</div>}
      </form>
    </div>
  );
}
