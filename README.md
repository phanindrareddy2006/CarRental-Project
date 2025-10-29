# 🚗 Car Rental Management System

A full-stack **Car Rental Web Application** built using **React (Vite)** for the frontend, **Spring Boot** for the backend, and **MySQL (Railway)** for data storage.  
Deployed seamlessly on **Vercel**, **Render**, and **Railway**.

---

## 🌐 Live Demo

- **Frontend:** [https://carrentalbyphanindra-tan.vercel.app](https://carrentalbyphanindra-tan.vercel.app)  
- **Backend API:** [https://carrental-project-8862.onrender.com](https://carrental-project-8862.onrender.com)

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:------------|
| Frontend | React (Vite), Axios, React Router, Toastify |
| Backend | Spring Boot (REST API) |
| Database | MySQL (Railway) |
| Deployment | Vercel → Frontend, Render → Backend, Railway → DB |
| Cloud Storage | Cloudinary (for image uploads) |

---

## ✨ Features

- 🚘 Browse and book cars in real time  
- 🔑 Secure user authentication  
- 🧾 Manage bookings, users, and cars  
- ☁️ Image uploads with Cloudinary integration  
- 📱 Responsive and modern UI  
- ⚙️ Deployed with full CI/CD pipeline  

---

## ⚡ Quick Start (Local Setup)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/phanindrareddy2006/CarRental-Project.git
cd CarRental-Project

### 2️⃣ Backend Setup (Spring Boot)
cd car-rental-backend
# open in STS or run directly
mvn spring-boot:run

### 3️⃣ Frontend Setup (React)
cd ../frontend
npm install
npm run dev
