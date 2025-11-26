import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { authAPI } from '../../services/apiClient'

const ENABLE_GOOGLE_LOGIN = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [selectedRole, setSelectedRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if role was set from homepage
    const role = localStorage.getItem('campuscare_selectedRole') || 'student'
    setSelectedRole(role)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authAPI.login({
        email: formData.email.toLowerCase(),
        password: formData.password
      })

      // Only allow students to login from /login page
      if (data.user.role !== 'student') {
        setError('Admin login is not allowed here. Please use the admin portal.')
        return
      }

      if (onLogin) {
        onLogin(data.user, data.token)
      } else {
        localStorage.setItem('campuscare_token', data.token)
        localStorage.setItem('campuscare_student_session', JSON.stringify(data.user))
        navigate('/student/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Check if Google Client ID is configured (only when Google login is enabled)
  const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
  const isGoogleConfigured = ENABLE_GOOGLE_LOGIN &&
    GOOGLE_CLIENT_ID &&
    GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' &&
    GOOGLE_CLIENT_ID !== 'dummy-client-id-for-development'

  // Google Login Handler
  const handleGoogleLoginHook = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        )

        const googleUser = {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
          googleId: userInfo.data.sub
        }

        // Check if user exists in local storage
        let users = JSON.parse(localStorage.getItem('campuscare_users') || '[]')
        let user = users.find((u) => u.email === googleUser.email.toLowerCase())

        // If user doesn't exist, create a new one
        if (!user) {
          user = {
            email: googleUser.email.toLowerCase(),
            name: googleUser.name,
            password: '', // No password for Google users
            role: selectedRole,
            googleId: googleUser.googleId,
            picture: googleUser.picture,
            loginMethod: 'google'
          }
          users.push(user)
          localStorage.setItem('campuscare_users', JSON.stringify(users))
        } else {
          // Update existing user with Google info if needed
          user.googleId = googleUser.googleId
          user.picture = googleUser.picture
          user.loginMethod = 'google'
          localStorage.setItem('campuscare_users', JSON.stringify(users))
        }

        // Store session
        localStorage.setItem(
          'campuscare_student_session',
          JSON.stringify({
            email: user.email,
            name: user.name,
            role: user.role || selectedRole,
            picture: user.picture,
            ts: Date.now(),
            loginMethod: 'google'
          })
        )

        // Navigate based on role
        if (selectedRole === 'admin' || user.role === 'admin') {
          navigate('/adminpannel')
        } else {
          navigate('/student')
        }
      } catch (error) {
        console.error('Google login error:', error)
        if (error.response?.status === 401) {
          alert('Google OAuth Client ID is not configured correctly. Please check your settings.')
        } else {
          alert('Failed to login with Google. Please try again.')
        }
      }
    },
    onError: (error) => {
      console.error('Google login error:', error)
      if (error.error === 'popup_closed_by_user') {
        // User closed the popup, don't show error
        return
      }
      let errorMessage = 'Failed to login with Google. '
      if (error.error === 'invalid_client') {
        errorMessage += 'Please configure your Google OAuth Client ID correctly.'
      } else {
        errorMessage += 'Please try again.'
      }
      alert(errorMessage)
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-4 sm:py-6 flex items-center justify-center">
        <div className="max-w-[500px] w-full mx-auto px-6 sm:px-8">
          <section id="login" className="w-full">
            <div className="mb-6 text-center">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-2 text-[#292929]">
                Welcome Back
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full mx-auto mb-2"></div>
              <p className="text-[#545454] text-sm sm:text-base">
                Sign in to access your Campus Care account
              </p>
            </div>
            
            <div className="text-sm text-[#545454] mb-4 p-3 bg-gradient-to-r from-[#fff5e6] to-[#fff9e6] rounded-xl border-2 border-[#ffc53a]/40 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <i className="bx bx-user-circle text-[#de1819] text-lg"></i>
                <span>Logging in as:{' '}</span>
                <strong className="text-[#de1819]">
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide flex items-center gap-2">
                    <i className="bx bx-envelope text-[#de1819]"></i>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      placeholder={selectedRole === 'admin' ? 'admin@college.edu' : 'you@college.edu'}
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50 bg-[#fafafa]"
                    />
                    <i className="bx bxs-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-[#545454] text-lg"></i>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide flex items-center gap-2">
                    <i className="bx bx-lock text-[#de1819]"></i>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 pr-12 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50 bg-[#fafafa]"
                    />
                    <i className="bx bxs-lock-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-[#545454] text-lg"></i>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#545454] hover:text-[#de1819] transition-colors"
                    >
                      <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} text-xl`}></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#de1819] rounded focus:ring-[#de1819]" />
                    <span className="text-[#545454]">Remember me</span>
                  </label>
                  <Link
                    to="#"
                    className="text-[#de1819] hover:text-[#ffc53a] transition-colors font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-[#de1819] to-[#e53935] text-white border-none px-8 py-4 rounded-xl font-bold cursor-pointer hover:from-[#e53935] hover:to-[#de1819] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="bx bx-log-in text-xl"></i>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>

                {ENABLE_GOOGLE_LOGIN && (
                  <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e6e6e6]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#545454]">Or continue with</span>
                  </div>
                </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isGoogleConfigured) {
                          alert('Google OAuth is not configured. Please set up your Google Client ID.')
                          return
                        }
                        handleGoogleLoginHook()
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 border-2 border-[#e6e6e6] rounded-xl hover:border-[#de1819] hover:bg-[#fff5f5] transition-all duration-300 bg-white font-semibold text-[#545454] hover:text-[#de1819]"
                    >
                      <i className="bx bxl-google text-2xl text-[#4285F4]"></i>
                      <span>Sign in with Google</span>
                    </button>
                  </>
                )}
                {ENABLE_GOOGLE_LOGIN && !isGoogleConfigured && (
                  <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800 text-center">
                      <i className="bx bx-info-circle inline mr-2"></i>
                      Google login is enabled but not configured. Please set up your Google OAuth Client ID.
                    </p>
                  </div>
                )}

                <div className="text-center pt-3 border-t border-[#e6e6e6]">
                  <p className="text-[#545454] text-sm">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="text-[#de1819] no-underline font-bold hover:text-[#ffc53a] transition-colors duration-300"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login
