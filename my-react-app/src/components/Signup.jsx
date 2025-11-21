import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Fill all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // Store user list
    const users = JSON.parse(localStorage.getItem('campuscare_users') || '[]')
    const exists = users.find((u) => u.email === formData.email.toLowerCase())
    if (exists) {
      alert('An account with this email exists. Please login.')
      navigate('/login')
      return
    }

    users.push({
      name: formData.name,
      email: formData.email.toLowerCase(),
      password: formData.password,
      role: 'student',
      created: new Date().toISOString()
    })
    localStorage.setItem('campuscare_users', JSON.stringify(users))
    alert('Signup successful! Please login.')
    navigate('/login')
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
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#ffc53a] text-[#de1819] border-none px-6 py-3 rounded-lg font-bold cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg w-full"
                  >
                    Sign Up
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
