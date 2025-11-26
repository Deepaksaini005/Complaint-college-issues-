import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminPortal.css'
import { authAPI } from '../../services/apiClient'

const AdminPortal = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email) {
      nextErrors.email = 'Admin email is required'
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      nextErrors.email = 'Provide a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setStatus({
      state: 'processing',
      message: 'Validating credentials...'
    })

    try {
      const data = await authAPI.login(formData)
      if (data.user.role === 'student') {
        setStatus({ state: 'error', message: 'Student accounts cannot access admin portal' })
        return
      }
      onLogin?.(data.user, data.token)
      setStatus({
        state: 'success',
        message: 'Login successful! Redirecting to dashboard...'
      })
      navigate('/admin/dashboard')
    } catch (error) {
      setStatus({
        state: 'error',
        message: error.message || 'Unable to login'
      })
    }
  }

  return (
    <div className="admin-portal">
      <section className="admin-card">
        <p className="eyebrow">Management Portal</p>
        <h2>Admin Secure Login</h2>
        <p className="intro">
          Login to access the admin dashboard and manage campus complaints.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </label>

          <button type="submit" className="secure-btn">
            {status.state === 'processing' ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            className="demo-btn"
            onClick={() => {
              const demoData = {
                email: 'super.admin@campuscare.com',
                password: 'admin123'
              }
              setFormData(demoData)
              setErrors({})
              setStatus({ state: 'info', message: 'Demo credentials filled. Click login to proceed.' })
            }}
          >
            <i className="bx bx-play-circle"></i>
            Demo Login
          </button>

          {status.state !== 'idle' && (
            <div
              className={`status-banner ${
                status.state === 'success' ? 'success' : status.state === 'error' ? 'error' : 'info'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <a href="/admin/register" onClick={(e) => {
                e.preventDefault()
                navigate('/admin/register')
              }}>
                Register here
              </a>
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AdminPortal

