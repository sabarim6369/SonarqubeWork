/* eslint-disable react/prop-types */

import { useState } from "react";
import {
  X,
  CheckCircle,
  User,
  Mail,
  Award,
  Phone,
  MapPin,
} from "lucide-react";
import { handleAddCollege } from "../../services/AdminOperations";
import { showToast } from "../../hooks/useToast";

export default function AddCollege({
  isOpen,
  onRequestClose,
  onAddTrainerSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    departments: "",
    phone: "",
    email: "",
  });

  const token = localStorage.getItem("Token");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.location.trim()) newErrors.location = "Address is required.";
    if (!formData.departments.trim())
      newErrors.departments = "Departments are required."; 

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fill in all required fields.", "error"); 
      return;
    }

    console.log("Saving College Data:", formData);

    try {
      const formattedData = {
        ...formData,
        departments: formData.departments.split(",").map((dept) => dept.trim()),
      };

      const response = await handleAddCollege(token, formattedData);

      console.log("API Response:", response);

      if (response.success) {
        console.log("College added:", response.college);
        showToast(
          response.message || "New College added successfully.",
          "success"
        );

        setFormData({
          name: "",
          location: "",
          departments: "",
          phone: "",
          email: "",
        });

        onAddTrainerSuccess(); 
        onRequestClose();
      } else {
        console.log("Error adding college:", response);
        showToast(response.message || "Error adding college.", "error"); 
      }
    } catch (error) {
      console.error("Error while saving college:", error);

      showToast(
        error.response?.data?.message || "Server error while adding college.",
        "error"
      );
    }
  };

  const handleClose = () => {
    console.log("Panel closed");
    onRequestClose();
  };

  return (
    <div
      className={`add-trainer-panel ${
        isOpen ? "add-trainer-panel--open" : "add-trainer-panel--close"
      }`}
    >
      <div className="add-trainer-panel__header">
        <h2 className="add-trainer-panel__title">Add College</h2>
        <button className="add-trainer-panel__close-icon" onClick={handleClose}>
          <X color="#333" size={24} />
        </button>
      </div>
      <form className="add-trainer-panel__form">
        <div className="add-trainer-panel__form-group">
          <label>
            <User style={{ marginRight: "8px" }} />
            Collegename
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter College name"
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="add-trainer-panel__form-group">
          <label>
            <Mail style={{ marginRight: "8px" }} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter trainer's email"
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className="add-trainer-panel__form-group">
          <label>
            <Phone style={{ marginRight: "8px" }} />
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="add-trainer-panel__form-group">
          <label>
            <MapPin style={{ marginRight: "8px" }} />
            Address
          </label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            rows="3"
            required
          />
          {errors.location && (
            <span className="error-text">{errors.location}</span>
          )}
        </div>
        <div className="add-trainer-panel__form-group">
          <label>
            <Award style={{ marginRight: "8px" }} />
            Available Departments
          </label>
          <input
            type="text"
            name="departments"
            value={formData.departments}
            onChange={handleChange}
            placeholder="Enter departments (comma-separated)"
            required
          />
          <div className="selected-departments">
            {formData.departments
              .split(",")
              .map((dept) => dept.trim())
              .filter((dept) => dept)
              .map((dept, index) => (
                <span key={index} className="department-tag">
                  {dept}
                </span>
              ))}
          </div>
          {errors.departments && (
            <span className="error-text">{errors.departments}</span>
          )}
        </div>

        <div className="add-trainer-panel__actions">
          <button
            type="button"
            className="add-trainer-panel__save-button"
            onClick={handleSave}
          >
            <CheckCircle size={"1rem"} style={{ marginRight: "5px" }} />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}