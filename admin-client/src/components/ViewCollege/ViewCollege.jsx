/* eslint-disable react/prop-types */
import { X, Mail, Phone, MapPin, Award } from "lucide-react";
import "./ViewCollege.css";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { deleteCollege } from "../../services/AdminOperations";

export default function ViewCollege({ onClose, college }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("Token");
  if (!college) return null;

  const handleDeleteCollege = async () => {
    console.log(college)
    const response = await deleteCollege(
      college._id,
      token,
      dispatch
    );
    if(response?.success){
        toast.success("College deleted successfully!")
        onClose()
    }
    else{
        toast.error(response.message)
    }
  };

  return (
    <div className="view-college-modal-overlay">
      <div className="view-college-modal">
        <div className="view-college-modal-header">
          <h2>{college.name}</h2>
          <X
            style={{
              cursor: "pointer",
            }}
            color="#BE3144"
            onClick={onClose}
            size={24}
          />
        </div>
        <div className="view-college-modal-body">
          <p>
            <Mail size={16} /> <strong>Email:</strong> {college.email}
          </p>
          <p>
            <Phone size={16} /> <strong>Phone:</strong> {college.phone}
          </p>
          <p>
            <MapPin size={16} /> <strong>Location:</strong> {college.location}
          </p>
          <p>
            <Award size={16} /> <strong>Departments:</strong>{" "}
            {college.departments.join(", ")}
          </p>
        </div>
        <div className="view-college-modal-footer">
          <button
            onClick={handleDeleteCollege}
            className="college-delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}