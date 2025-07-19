import { useState } from "react";
import "./Auth.css";
import loginIllustration from "../../assets/images/login.svg";
import signupIllustration from "../../assets/images/signup.svg";

import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const [isLogin, setLogin] = useState(true);
  return (
    <section className="auth-page-container">
      <div
        className="auth-page-inner-container"
        style={{ transform: isLogin ? null : "translateX(-100vw)" }}
      >
        <div className="auth-page-login-container">
          <div className="auth-page-login-form-container">
            <Login />
          </div>
          <div className="auth-page-login-illustration-container">
            <div className="auth-page-login-illustration-inner-container">
              <div className="auth-page-login-illustration-heading-container" style={{transform: isLogin ? null : "translateY(-12vh)"}}>
                Your next great project is waiting
              </div>
              <img src={loginIllustration} alt="illustration" style={{transform: isLogin ? null : "translateY(70vh)"}}></img>
              <div className="auth-page-login-illustration-bottom-container" style={{transform: isLogin ? null : "translateY(18vh)"}}>
                <div>Dont have an account?</div>
                <button onClick={() => setLogin(false)}>Signup</button>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-page-signup-container">
          <div className="auth-page-signup-illustration-container">
            <div className="auth-page-signup-illustration-inner-container">
              <div className="auth-page-signup-illustration-heading-container"  style={{transform: !isLogin ? null : "translateY(-12vh)"}}>
              Create, debug, and innovate with us
              </div>
              <img src={signupIllustration} alt="illustration"  style={{transform: !isLogin ? null : "translateY(70vh)"}}></img>
              <div className="auth-page-login-illustration-bottom-container"  style={{transform: !isLogin ? null : "translateY(18vh)"}}>
                <div>Already have an account</div>
                <button onClick={() => setLogin(true)}>Login</button>
              </div>
            </div>
          </div>
          <div className="auth-page-signup-form-container">
          <Signup setLogin={setLogin} />
          </div>
        </div>
      </div>
    </section>
  );
}
