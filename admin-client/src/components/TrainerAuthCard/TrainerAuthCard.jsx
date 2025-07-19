import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { handleTrainerLogin } from "../../services/TrainerOperations";
import { showToast } from "../../hooks/useToast";

export default function TrainerAuthCard() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [render, setRender] = useState(false);
    const token = localStorage.getItem('Token')

    const handleSignin = async () => {

        const response = await handleTrainerLogin(token, formData)
        if (response?.success) {
            showToast("Login Successful", "success");
            localStorage.setItem("Token", response.token)
            window.location.href = "/trainer"
        }
        else {
            showToast("Invalid Credentials", "error");
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="authpage-right-trainer-container">
            <div className={`authpage-right-trainer-header ${!render ? "right-header-visible" : ""}`}>
                <div className="authpage-right-title">Trainer Portal</div>
                <div className="authpage-right-subtitle">
                    Sign up to inspire and guide learners
                </div>
            </div>
            <div className="authpage-right-trainer-content">
                <div className="authpage-right-trainer-form">
                    <div className="authpage-right-trainer-email-wrapper">
                        <label className="authpage-right-trainer-email-label">
                            <Mail size={"1.2rem"} color="#374151" style={{ marginRight: '8px' }} /> Email
                        </label>
                        <input
                            className="authpage-right-trainer-email-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="authpage-right-trainer-password-wrapper">
                        <label className="authpage-right-trainer-password-label">
                            <Lock size={"1.2rem"} color="#374151" style={{ marginRight: '8px' }} /> Password
                        </label>
                        <input
                            className="authpage-right-trainer-password-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="authpage-right-trainer-login-button"
                    style={{
                        marginTop: "1rem",
                        width: "100%",
                        borderRadius: "10px"
                    }}
                    onClick={handleSignin}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
}
