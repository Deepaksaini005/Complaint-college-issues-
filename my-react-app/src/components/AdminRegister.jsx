import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminPortal.css'

const AdminRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 3) {
      nextErrors.name = 'Name must be at least 3 characters'
    }

    if (!formData.email) {
      nextErrors.email = 'Email is required'
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      nextErrors.email = 'Provide a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setStatus({
      state: 'processing',
      message: 'Creating your admin account...'
    })

    // Mock async registration flow
    setTimeout(() => {
      setStatus({
        state: 'success',
        message: 'Registration successful! Redirecting to login...'
      })
      
      setTimeout(() => {
        navigate('/adminpannel')
      }, 1500)
    }, 800)
  }

  return (
    <div className="admin-portal">
      <section className="admin-card">
        <p className="eyebrow">Admin Registration</p>
        <h2>Create Admin Account</h2>
        <p className="intro">
          Register as an admin to access the campus management dashboard.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Admin Email
            <input
              type="email"
              name="email"
              placeholder="admin@campus.edu"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </label>

          <button type="submit" className="secure-btn">
            {status.state === 'processing' ? 'Registering...' : 'Register'}
          </button>

          {status.state !== 'idle' && (
            <div
              className={`status-banner ${
                status.state === 'success' ? 'success' : 'info'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="register-link">
            <p>
              Already have an account?{' '}
              <a href="/adminpannel" onClick={(e) => {
                e.preventDefault()
                navigate('/adminpannel')
              }}>
                Login here
              </a>
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AdminRegister

