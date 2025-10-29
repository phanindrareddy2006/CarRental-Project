import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitMessage, setSubmitMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8118/api/contact/submit", formData);

      setIsError(false);
      setSubmitMessage("Thank you! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setIsError(true);
      setSubmitMessage("Failed to submit message. Try again later.");
    }
  };

  return (
    <section className="page-section">
      <h2>Contact Us</h2>
      <p>Have questions? Reach out to us and we'll be happy to help.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows={5}
        />
        <button type="submit">Send Message</button>
      </form>

      {submitMessage && (
        <p className={`submit-message ${isError ? "error" : "success"}`}>
          {submitMessage}
        </p>
      )}
    </section>
  );
}
