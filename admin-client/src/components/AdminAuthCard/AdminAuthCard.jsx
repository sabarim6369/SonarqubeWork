import { useState } from "react";
import { Mail, Lock, User, Phone } from "lucide-react";
import { adminSignin, adminSignup } from "../../services/AdminOperations";
import { showToast } from "../../hooks/useToast";

export default function AdminAuthCard() {
  const [isSignup, setIsSignup] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminSignup(signupData);

      if (response.success) {
        await showToast(response.message, "success");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Signup failed:", error.message || error);
      alert("Something went wrong. Please try again.");
      showToast(
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminSignin(loginData);

      if (response && response.success) {
        localStorage.setItem("Token", response.data.token);
        showToast("Login successful!", "success");
        window.location.href = "/admin";
      } else {
        console.log("Login failed:", response);
        showToast("Login failed!", "error");
      }
    } catch (error) {
      console.error("Login failed:", error.message || error);
      alert("Something went wrong. Please try again.");
      showToast(
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  return (
    <div className="authpage-right-admin-container">
      <div
        className={`authpage-right-admin-header ${
          !isSignup ? "right-header-visible" : ""
        }`}
      >
        <div className="authpage-right-title">Admin Portal</div>
        <div className="authpage-right-subtitle">
          {isSignup
            ? "Sign up to manage programs and trainers"
            : "Sign in to manage programs and trainers"}
        </div>
      </div>
      <div className="authpage-right-admin-content">
        <form
          className="authpage-right-admin-form"
          onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
        >
          {isSignup && (
            <div
              className={`authpage-right-admin-form-groups ${
                isSignup ? "grid-layout" : ""
              } `}
            >
              <div className="authpage-right-admin-name">
                <label className="authpage-right-admin-name-label">
                  <User
                    color="#374151"
                    size={"1.2rem"}
                    style={{ marginRight: "8px" }}
                  />
                  Name
                </label>
                <input
                  className="authpage-right-admin-name-input"
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="authpage-right-admin-phone">
                <label className="authpage-right-admin-phone-label">
                  <Phone
                    color="#374151"
                    size={"1.2rem"}
                    style={{ marginRight: "8px" }}
                  />
                  Phone
                </label>
                <input
                  className="authpage-right-admin-phone-input"
                  type="tel"
                  name="phone"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>
          )}
          <div
            className={`authpage-right-admin-form-groups ${
              isSignup ? "grid-layout" : ""
            } `}
          >
            <div className="authpage-right-admin-email">
              <label className="authpage-right-admin-email-label">
                <Mail
                  color="#374151"
                  size={"1.2rem"}
                  style={{ marginRight: "8px" }}
                />
                Email
              </label>
              <input
                className="authpage-right-admin-email-input"
                type="email"
                name="email"
                value={isSignup ? signupData.email : loginData.email}
                onChange={isSignup ? handleSignupChange : handleLoginChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="authpage-right-admin-password">
              <label className="authpage-right-admin-password-label">
                <Lock
                  color="#374151"
                  size={"1.2rem"}
                  style={{ marginRight: "8px" }}
                />
                Password
              </label>
              <input
                className="authpage-right-admin-password-input"
                type="password"
                name="password"
                value={isSignup ? signupData.password : loginData.password}
                onChange={isSignup ? handleSignupChange : handleLoginChange}
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`authpage-right-admin-${
              isSignup ? "signup" : "login"
            }-button`}
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
