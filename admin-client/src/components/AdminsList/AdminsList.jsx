import { useEffect, useState } from "react";
import { deleteAdmin, getAdmins } from "../../services/AdminOperations";
import toast from "react-hot-toast";
import "./AdminsList.css";
import { useDispatch, useSelector } from "react-redux";

export default function AdminsList({  onClose }) {
  const [admins, setAdmins] = useState([]);
  const token = localStorage.getItem("Token");
  const dispatch = useDispatch();
  const currentAdminId = useSelector((state) => state.auth.id);

  console.log(currentAdminId)

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins(token,dispatch);
      if (response) {
        setAdmins(response);
      } else {
        toast.error("Failed to fetch admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleDelete = async (adminId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (!confirmDelete) {
        return;
    }
    try {
      const response = await deleteAdmin(adminId, token,dispatch);
      if (response.success) {
        toast.success("Admin deleted successfully");
        fetchAdmins();
      } else {
        toast.error("Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="overlay">
      <div className="admins-list-container">
        <h2 className="admins-list-title">Admins</h2>
        <table className="admins-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.name} {currentAdminId == admin.adminId && " - (You)"} </td>
                  <td>{admin.email}</td>
                  <td>{admin.phone}</td>
                  <td>
                    <button
                      className="admins-list-delete-btn"
                      onClick={() => handleDelete(admin._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="admins-list-empty">No admins found</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="admins-list-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}