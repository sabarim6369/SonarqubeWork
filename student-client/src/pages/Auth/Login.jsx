import { useState  } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { BACKEND_URI } from "../../utils/connectivity";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URI}/student/login`, {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-inner-container" onSubmit={handleLogin}>
        <div className="login-heading">
          LOGIN TO RAMPEX MANAGEMENT SYSTEM
          <div></div>
          <span className="login-input-element-description">
            Login to the existing account by using email and password
          </span>
        </div>
        <div className="login-input-outer-container">
          <div className="login-input-element-container">
            <div>email</div>
            <input
              type="email"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-input-element-container">
            <div>password</div>
            <input
              type="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-forgot-password">
            forgot password ? <span>Click Here</span>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="login-input-button-container">
          <button type="submit">LOGIN</button>
        </div>
      </form>
    </div>
  );
}
