import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./OurCars.css";

// ✅ Always visible default cars
const staticCars = [
  { id: 2000, name: "BMW X5", type: "SUV", price: "₹60", description: "Luxury SUV with powerful engine.", image: "/assets/BMW X5.jpg" },
  { id: 2001, name: "Honda Civic", type: "Sedan", price: "₹40", description: "Reliable and fuel efficient.", image: "/assets/Honda Civic.jpg" },
  { id: 2002, name: "Hyundai i20", type: "Hatchback", price: "₹50", description: "Compact car perfect for city driving.", image: "/assets/Hyundai i20.jpg" },
  { id: 2003, name: "Toyota RAV4", type: "SUV", price: "₹40", description: "Comfortable SUV with advanced features.", image: "/assets/Toyota RAV4.jpg" },
];

export default function OurCars({ user }) {
  const [cars, setCars] = useState(staticCars);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCar, setNewCar] = useState({ name: "", type: "", price: "", description: "", imageFile: null });
  const [editCar, setEditCar] = useState({ id: null, name: "", type: "", price: "", description: "", imageFile: null, imageUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);
  // ✅ Fetch cars from backend
  useEffect(() => {
    fetch("https://carrental-project-8862.onrender.com/api/cars")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const backendCars = data.map((car) => ({
            id: car.id,
            name: car.name,
            type: car.type,
            price: `₹${car.price}`,
            image: car.imageUrl || "/assets/default-car.png",
            description: car.description || "No description available.",
          }));
          // ✅ Combine backend + static cars
          setCars([...staticCars, ...backendCars]);
        }
      })
      .catch(() => setCars(staticCars)); // fallback if fetch fails
  }, []);

  // ===== Upload image =====
  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://carrental-project-8862.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch {
      setUploading(false);
      return null;
    }
  };

  // ===== Handle change =====
  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    isEdit ? setEditCar({ ...editCar, [name]: value }) : setNewCar({ ...newCar, [name]: value });
  };

  // ===== Handle file =====
  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isEdit) setEditCar({ ...editCar, imageFile: file });
    else setNewCar({ ...newCar, imageFile: file });
    setPreview(URL.createObjectURL(file));
  };

  // ===== Add car =====
  const handleAddCar = async () => {
    if (!newCar.name || !newCar.type || !newCar.price || !newCar.description) {
      alert("Please fill all fields.");
      return;
    }

    let imageUrl = "/assets/default-car.png";
    if (newCar.imageFile) {
      const uploadedUrl = await uploadImage(newCar.imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const payload = {
      name: newCar.name,
      type: newCar.type,
      price: parseFloat(newCar.price),
      description: newCar.description,
      imageUrl,
    };

    try {
      const res = await fetch("https://carrental-project-8862.onrender.com/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add car");
      const data = await res.json();

      setCars([{ ...data, price: `₹${data.price}`, image: data.imageUrl }, ...cars]);
      setShowAddModal(false);
      setNewCar({ name: "", type: "", price: "", description: "", imageFile: null });
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Update car =====
  const handleUpdateCar = async () => {
    let imageUrl = editCar.imageUrl;
    if (editCar.imageFile) {
      const uploadedUrl = await uploadImage(editCar.imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const payload = {
      name: editCar.name,
      type: editCar.type,
      price: parseFloat(editCar.price),
      description: editCar.description,
      imageUrl,
    };

    try {
      const res = await fetch(`https://carrental-project-8862.onrender.com/api/cars/${editCar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      setCars(
        cars.map((car) =>
          car.id === data.id
            ? { ...car, name: data.name, type: data.type, price: `₹${data.price}`, image: data.imageUrl, description: data.description }
            : car
        )
      );
      setShowEditModal(false);
      setShowDetailModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Delete car =====
  const handleRemoveCar = (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    fetch(`https://carrental-project-8862.onrender.com/api/cars/${id}`, { method: "DELETE" })
      .then(() => setCars(cars.filter((c) => c.id !== id)))
      .catch((err) => console.error("Delete failed:", err));
  };

  // ===== Book car =====
  const handleBook = (car) => {
    if (!user) return navigate("/signup");
    setShowDetailModal(false);
    navigate("/booking", { state: { car } });
  };

  const openEditModal = (car) => {
    setEditCar({
      id: car.id,
      name: car.name,
      type: car.type,
      price: car.price.replace("₹", ""),
      imageUrl: car.image,
      description: car.description,
      imageFile: null,
    });
    setShowEditModal(true);
  };

  return (
    <div className="cars-page">
      <h2>Our Cars</h2>

      {user?.role === "ADMIN" && (
        <button className="btn-add add-car-btn" onClick={() => setShowAddModal(true)}>
          Add Car
        </button>
      )}

      <div className="car-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.name} className="car-image" />
            <h3>{car.name}</h3>
            <p>Type: {car.type}</p>
            <p className="price">{car.price}</p>
            <div className="card-buttons" style={{ justifyContent: "center" }}>
              <button className="btn-secondary" onClick={() => { setSelectedCar(car); setShowDetailModal(true); }}>
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Add Modal ===== */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Car</h3>
            <input type="text" name="name" placeholder="Name" value={newCar.name} onChange={handleChange} />
            <input type="text" name="type" placeholder="Type" value={newCar.type} onChange={handleChange} />
            <input type="number" name="price" placeholder="Price" value={newCar.price} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={newCar.description} onChange={handleChange}></textarea>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false)} />
            {preview && <img src={preview} alt="Preview" width="160" style={{ marginTop: "10px", borderRadius: "8px" }} />}
            {uploading && <p>Uploading image...</p>}
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleAddCar} disabled={uploading}>Submit</button>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {showEditModal && (
        <div className="modal edit-modal">
          <div className="modal-content">
            <h3>Edit Car</h3>
            <input type="text" name="name" value={editCar.name} onChange={(e) => handleChange(e, true)} />
            <input type="text" name="type" value={editCar.type} onChange={(e) => handleChange(e, true)} />
            <input type="number" name="price" value={editCar.price} onChange={(e) => handleChange(e, true)} />
            <textarea name="description" value={editCar.description} onChange={(e) => handleChange(e, true)}></textarea>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
            {preview && <img src={preview} alt="Preview" width="160" style={{ marginTop: "10px", borderRadius: "8px" }} />}
            {uploading && <p>Uploading image...</p>}
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleUpdateCar} disabled={uploading}>Update</button>
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Details Modal ===== */}
      {showDetailModal && selectedCar && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedCar.name}</h3>
            <img src={selectedCar.image} alt={selectedCar.name} className="car-image-large" />
            <p><strong>Type:</strong> {selectedCar.type}</p>
            <p><strong>Price:</strong> {selectedCar.price}</p>
            <p><strong>Description:</strong> {selectedCar.description}</p>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={() => handleBook(selectedCar)}>Book</button>
              {user?.role === "ADMIN" && <button className="btn-secondary" onClick={() => openEditModal(selectedCar)}>Update</button>}
              {user?.role === "ADMIN" && <button className="btn-secondary" onClick={() => handleRemoveCar(selectedCar.id)}>Remove</button>}
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
