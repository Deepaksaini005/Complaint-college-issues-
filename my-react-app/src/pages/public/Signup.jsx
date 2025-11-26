import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { authAPI } from '../../services/apiClient'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    phoneNumber: '',
    department: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.registrationNumber || !formData.phoneNumber) {
      setError('Please fill all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const data = await authAPI.register({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: 'student',
        registrationNumber: formData.registrationNumber,
        phone: formData.phoneNumber,
        department: formData.department || 'General'
      })

      // Don't store token/session - redirect to login
      alert('Signup successful! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <section id="signup" className="max-w-[500px] mx-auto">
            <div className="mb-6">
              <h2 className="font-['Work_Sans'] font-extrabold text-2xl sm:text-3xl m-0 mb-2 border-l-4 border-[#de1819] pl-4 text-[#292929]">
                Sign Up
              </h2>
              <p className="text-[#545454] text-sm sm:text-base mt-2">
                Create your Campus Care account to get started
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@college.edu"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="registrationNumber"
                    type="text"
                    placeholder="e.g., REG2024001"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">
                    Department
                  </label>
                  <input
                    name="department"
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Choose a password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#e6e6e6] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 font-['Montserrat']"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ffc53a] text-[#de1819] border-none px-6 py-3 rounded-lg font-bold cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </div>
                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="text-[#de1819] no-underline font-semibold hover:text-[#ffc53a] transition-colors duration-200 text-sm"
                  >
                    Already have an account? Login
                  </Link>
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

export default Signup
