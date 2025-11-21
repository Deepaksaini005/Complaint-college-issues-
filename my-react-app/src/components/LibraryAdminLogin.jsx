import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminPortal.css'

const LibraryAdminLogin = ({ onLogin }) => {
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
      nextErrors.email = 'Email is required'
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

  const handleSubmit = (event) => {
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

    setTimeout(() => {
      setStatus({
        state: 'success',
        message: 'Login successful! Redirecting to dashboard...'
      })
      
      if (onLogin) {
        onLogin('Library Admin')
      }
      setTimeout(() => {
        navigate('/admin/library/dashboard')
      }, 1000)
    }, 650)
  }

  return (
    <div className="admin-portal">
      <section className="admin-card">
        <p className="eyebrow">Library Admin Portal</p>
        <h2>Library Admin Login</h2>
        <p className="intro">
          Login to manage library resources and services.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Admin Email
            <input
              type="email"
              name="email"
              placeholder="library.admin@campus.edu"
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
                email: 'library@campus.edu',
                password: 'library123'
              }
              setFormData(demoData)
              setErrors({})
              
              setStatus({
                state: 'processing',
                message: 'Validating credentials...'
              })

              setTimeout(() => {
                setStatus({
                  state: 'success',
                  message: 'Login successful! Redirecting to dashboard...'
                })
                
                if (onLogin) {
                  onLogin('Library Admin')
                }
                setTimeout(() => {
                  navigate('/admin/library/dashboard')
                }, 1000)
              }, 650)
            }}
          >
            <i className="bx bx-play-circle"></i>
            Demo Login
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
              Need access? Contact{' '}
              <a href="mailto:superadmin@campus.edu">Super Admin</a>
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}

export default LibraryAdminLogin

