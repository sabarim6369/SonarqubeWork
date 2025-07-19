import "./header.css";
import { Bell, Settings } from "lucide-react";
import ProfileIcon from "../../assets/icons/profile.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "../ProfileModal/ProfileModal";
import { adminSignup, getAdmins } from "../../services/AdminOperations";
import toast from "react-hot-toast";
import AdminsList from "../AdminsList/AdminsList";

export default function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isAdminCreate, setIsAdminCreate] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isSeeAllAdmin, setIsSeeAllAdmin] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const token = localStorage.getItem("Token");
  const dispatch= useDispatch();

  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating Admin:", adminData);

    try {
      const response = await adminSignup(adminData, token);

      if (response.success) {
        toast.success("Admin created successfully");
      } else {
        toast.error("Failed to create admin");
      }
      setAdminData({ name: "", email: "", phone: "", password: "" });
      setIsAdminCreate(false);
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Failed to create admin");
    }
  };

  return (
    <div className="header-container">
      <div className="header-greeting">
        <span className="greeting-one">
          Welcome back,{" "}
          <span className="greeting-name">{user?.name || "null"}!</span>
        </span>
      </div>

      <div className="header-container-left">
        <div
          className="notification-icon-container"
          onClick={() => setIsSettingsVisible((prev) => !prev)}
        >
          <Settings
            style={{ cursor: "pointer", opacity: 0.7 }}
            color="#333"
            size="1.7em"
          />
        </div>
        <div className="header-separator"></div>
        <div
          className="profile-container"
          onClick={() => setShowProfileModal(true)}
        >
          <div className="profile-img-container">
            <img src={ProfileIcon} alt="Profile" className="profile-img" />
            <div className="profile-dot"></div>
          </div>
          <div className="profile-details">
            <div className="profile-name">{user?.name || "null"}</div>
            <div className="profile-role">{role || "null"}</div>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal
          requestClose={() => setShowProfileModal(false)}
          user={user}
          role={role}
        />
      )}

      {isSettingsVisible && (
        <div
          onMouseLeave={() => setIsSettingsVisible(false)}
          className={`settings-container ${isSettingsVisible ? "visible" : ""}`}
        >
          <div className="settings-container-header">Settings</div>
          <ol className="settings-container-list">
            <li onClick={()=>{
              setIsSeeAllAdmin(true)
            }}  >View All Admins</li>
            <li
              onClick={() => {
                setIsAdminCreate(true);
                setIsSettingsVisible(false);
              }}
            >
              Create Admin
            </li>
          </ol>
        </div>
      )}

      {isAdminCreate && (
        <div className="overlay">
          <div className="admin-create-container">
            <h2>Create Admin</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="admin-name">Name</label>
                <input
                  type="text"
                  id="admin-name"
                  name="name"
                  className="admin-input-name"
                  placeholder="Enter name"
                  value={adminData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="admin-email">Email</label>
                <input
                  type="email"
                  id="admin-email"
                  name="email"
                  className="admin-input-email"
                  placeholder="Enter email"
                  value={adminData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="admin-phone">Phone</label>
                <input
                  type="tel"
                  id="admin-phone"
                  name="phone"
                  className="admin-input-phone"
                  placeholder="Enter phone number"
                  value={adminData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  type="password"
                  id="admin-password"
                  name="password"
                  className="admin-input-password"
                  placeholder="Enter password"
                  value={adminData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-buttons">
                <button type="submit" className="admin-submit-button">
                  Create Admin
                </button>
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() => setIsAdminCreate(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {
        isSeeAllAdmin && <AdminsList onClose={() => setIsSeeAllAdmin(false)} />
      }
    </div>
  );
}
