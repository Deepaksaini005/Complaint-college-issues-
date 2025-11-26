import { useState, useEffect } from 'react'
import './Auth.css'
import { authAPI } from '../../services/apiClient'

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  useEffect(() => {
    const container = document.querySelector('.container')
    if (container) {
      if (isLogin) {
        container.classList.remove('active')
      } else {
        container.classList.add('active')
      }
    }
  }, [isLogin])

  const updateStatus = (state, message) => setStatus({ state, message })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    updateStatus('loading', 'Authenticating...')
    try {
      const data = await authAPI.login({ email: formData.email, password: formData.password })
      
      // Only allow students to login from student portal
      if (data.user.role !== 'student') {
        updateStatus('error', 'Admin login not allowed here. Please use admin portal.')
        return
      }
      
      updateStatus('success', 'Welcome back!')
      onLogin?.(data.user, data.token)
    } catch (error) {
      updateStatus('error', error.message)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    updateStatus('loading', 'Creating account...')
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student'
      }
      const data = await authAPI.register(payload)
      updateStatus('success', 'Account created! Redirecting...')
      onLogin?.(data.user, data.token)
    } catch (error) {
      updateStatus('error', error.message)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="container">
        {/* login form */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email address"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <i className="bx bxs-user" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <i className="bx bxs-lock-alt" />
            </div>
            <div className="forgot-link">
              <a href="#">forgot password?</a>
            </div>
            <button type="submit" className="btn">
              login
            </button>
            {isLogin && status.state !== 'idle' && (
              <p className={`status-text ${status.state}`}>{status.message}</p>
            )}
          </form>
        </div>
        {/* Registration */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Full name"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <i className="bx bxs-user" />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <i className="bx bxs-envelope" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <i className="bx bxs-lock-alt" />
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            {status.state !== 'idle' && (
              <p className={`status-text ${status.state}`}>{status.message}</p>
            )}
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
