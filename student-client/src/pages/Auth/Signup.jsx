import { useState, useEffect } from "react";
import axios, { getAdapter } from "axios";
import { BACKEND_URI } from "../../utils/connectivity";

export default function Signup({ setLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URI}/admin/get-all-colleges`
        );
        setColleges(response.data.colleges);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URI}/student/signup`, {
        username,
        email,
        password,
        age,
        gender,
        phone,
        college_id: selectedCollege === "other" ? "no-college-selected" : selectedCollege,
      });
      console.log("Signup successful:", response.data);
      setLogin(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <form className="signup-inner-container" onSubmit={handleSignup}>
        <div className="login-heading">
          SIGN UP TO RAMPEX MANAGEMENT SYSTEM
          <div></div>
          <span className="login-input-element-description">
            Signup to RampeX Management System using the email
          </span>
        </div>
        <div className="login-input-outer-container" style={{ height: "50%" }}>
          <div className="login-input-element-container">
            <div>username</div>
            <input
              type="text"
              placeholder="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-input-element-split-container">
            <section className="login-input-element-split-inner-container">
              <div>age</div>
              <input
                type="number"
                placeholder="age"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </section>
            <section className="login-input-element-split-inner-container">
              <div>gender</div>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </section>
          </div>

          <div className="login-input-element-container">
            <div>phone</div>
            <input
              type="number"
              placeholder="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
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
          <div className="login-input-element-container">
            <div>College</div>
            <select
              required
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="border-2 h-[5vh] outline-none rounded-[8px] border-blue bg-lightred" 
            >
              <option value="" disabled>
                Select college
              </option>
              {colleges &&
                colleges.map((college) => {
                  return (
                    <option key={college._id} value={college._id}>
                      {college.name}
                    </option>
                  );
                })}
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="login-input-button-container">
          <button type="submit">SIGN UP</button>
        </div>
      </form>
    </div>
  );
}
