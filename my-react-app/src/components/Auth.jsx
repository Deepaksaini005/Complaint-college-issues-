import { useState, useEffect } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const container = document.querySelector('.container');
    if (container) {
      if (isLogin) {
        container.classList.remove('active');
      } else {
        container.classList.add('active');
      }
    }
  }, [isLogin]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted');
    // Add your login logic here
    if (onLogin) {
      onLogin();
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Register submitted');
    // Add your registration logic here
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        {/* login form */}
        <div className="form-box login">
          <form action="" onSubmit={handleLoginSubmit}>
            <h1>login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required="" />
              <i className="bx bxs-user" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="password" required="" />
              <i className="bx bxs-lock-alt" />
            </div>
            <div className="forgot-link">
              <a href="#">forgot password?</a>
            </div>
            <button type="submit" className="btn">
              login
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#">
                <i className="bx bxl-google" />
              </a>
              <a href="#">
                <i className="bx bxl-facebook" />
              </a>
              <a href="#">
                <i className="bx bxl-github" />
              </a>
              <a href="#">
                <i className="bx bxl-linkedin" />
              </a>
            </div>
          </form>
        </div>
        {/* Registration */}
        <div className="form-box register">
          <form action="" onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required="" />
              <i className="bx bxs-user" />
            </div>
            <div className="input-box">
              <input type="text" placeholder="Email" required="" />
              <i className="bx bxs-envelope" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="password" required="" />
              <i className="bx bxs-lock-alt" />
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <p>or Register with social platforms</p>
            <div className="social-icons">
              <a href="#">
                <i className="bx bxl-google" />
              </a>
              <a href="#">
                <i className="bx bxl-facebook" />
              </a>
              <a href="#">
                <i className="bx bxl-github" />
              </a>
              <a href="#">
                <i className="bx bxl-linkedin" />
              </a>
            </div>
          </form>
        </div>
        {/* toggle */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button 
              className="btn register-btn" 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome to Campus Care</h1>
            <p>Already have an account?</p>
            <button 
              className="btn login-btn" 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
