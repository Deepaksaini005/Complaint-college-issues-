import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [selectedRole, setSelectedRole] = useState('student')

  useEffect(() => {
    // Check if role was set from homepage
    const role = localStorage.getItem('campuscare_selectedRole') || 'student'
    setSelectedRole(role)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('campuscare_users') || '[]')
    const user = users.find(
      (u) => u.email === formData.email.toLowerCase() && u.password === formData.password
    )

    if (!user) {
      alert('Invalid credentials or user not found')
      return
    }

    // Store session
    localStorage.setItem(
      'campuscare_session',
      JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role,
        ts: Date.now()
      })
    )

    // Navigate based on role
    if (selectedRole === 'admin' || user.role === 'admin') {
      navigate('/adminpannel')
    } else {
      navigate('/student')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fafafa] to-white text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <section id="login" className="max-w-[550px] mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-3 text-[#292929]">
                Login
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full mx-auto"></div>
              <p className="text-[#545454] text-base sm:text-lg mt-4">
                Access your Campus Care account
              </p>
            </div>
            <div className="text-sm text-[#545454] mb-6 p-4 bg-gradient-to-r from-white to-[#fafafa] rounded-xl border-2 border-[#ffc53a]/30">
              Logging in as:{' '}
              <strong className="text-[#de1819]">
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </strong>
            </div>
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder={selectedRole === 'admin' ? 'admin@college.edu' : 'you@college.edu'}
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#ffc53a] to-[#ffd966] text-[#de1819] border-none px-8 py-4 rounded-xl font-bold cursor-pointer hover:from-[#ffd966] hover:to-[#ffc53a] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl w-full"
                  >
                    Login
                  </button>
                </div>
                <div className="text-center pt-2">
                  <Link
                    to="/signup"
                    className="text-[#de1819] no-underline font-semibold hover:text-[#ffc53a] transition-colors duration-300 text-sm"
                  >
                    Don't have an account? Create one
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

export default Login
