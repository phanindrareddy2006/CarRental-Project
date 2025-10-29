import React from "react";
import "./Pricing.css";

export default function Pricing() {
  return (
    <section className="page-section">
      <h2>Pricing</h2>
      <p>
        We offer competitive pricing with no hidden fees. Our pricing plans are
        based on the type of vehicle you choose.
      </p>

      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Price/Day</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BMW X5</td>
            <td>SUV</td>
            <td>₹60</td>
          </tr>
          <tr>
            <td>Honda Civic</td>
            <td>Sedan</td>
            <td>₹40</td>
          </tr>
          <tr>
            <td>Hyundai i20</td>
            <td>Hatchback</td>
            <td>₹50</td>
          </tr>
          <tr>
            <td>Toyota RAV4</td>
            <td>SUV</td>
            <td>₹40</td>
          </tr>
        </tbody>
      </table>

      <p className="note">
        Contact us for special deals and long-term rental discounts!
      </p>
    </section>
  );
}
