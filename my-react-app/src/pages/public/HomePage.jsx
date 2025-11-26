import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function HomePage() {
  const navigate = useNavigate()

  // Animate counters on mount
  useEffect(() => {
    const animateValue = (id, start, end, duration) => {
      const el = document.getElementById(id)
      if (!el) return
      let startTimestamp = null
      const step = (ts) => {
        if (!startTimestamp) startTimestamp = ts
        const progress = Math.min((ts - startTimestamp) / duration, 1)
        el.textContent = Math.floor(progress * (end - start) + start)
        if (progress < 1) window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    }

    animateValue('statTotal', 0, 120, 900)
    animateValue('statResolved', 0, 95, 900)
    animateValue('statPending', 0, 25, 900)
  }, [])

  const handleAdminLogin = () => {
    navigate('/adminpannel')
  }

  const handleStudentLogin = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fafafa] to-white text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section
          className="w-full text-white relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(222, 24, 25, 0.92) 0%, rgba(192, 21, 22, 0.95) 100%), url(https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1400&q=60) center/cover no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
          <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl lg:text-6xl m-0 leading-tight drop-shadow-2xl">
                  Welcome to Campus Care
                </h1>
                <p className="max-w-[600px] text-lg sm:text-xl opacity-95 leading-relaxed font-light">
                  Campus Care is your one-stop portal to log, track and resolve campus facility
                  issues. Students can submit complaints, track status, give feedback and view
                  analytics — all in one place.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/complaints"
                    className="bg-gradient-to-r from-[#ffc53a] to-[#ffd966] text-[#de1819] border-none px-8 py-4 rounded-xl font-bold text-base no-underline inline-block hover:from-[#ffd966] hover:to-[#ffc53a] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    Explore Complaints
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-8 py-4 rounded-xl font-bold text-base no-underline inline-block hover:bg-white/20 hover:border-white/60 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/15 backdrop-blur-md text-white p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
                    <div className="text-xs text-white/90 mb-3 font-semibold uppercase tracking-wide">
                      Total Complaints
                    </div>
                    <div className="text-4xl font-extrabold drop-shadow-lg" id="statTotal">
                      120
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md text-white p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
                    <div className="text-xs text-white/90 mb-3 font-semibold uppercase tracking-wide">
                      Resolved
                    </div>
                    <div className="text-4xl font-extrabold drop-shadow-lg" id="statResolved">
                      95
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md text-white p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
                    <div className="text-xs text-white/90 mb-3 font-semibold uppercase tracking-wide">
                      Pending
                    </div>
                    <div className="text-4xl font-extrabold drop-shadow-lg" id="statPending">
                      25
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    id="adminLoginBtn"
                    className="bg-gradient-to-r from-[#ffc53a] to-[#ffd966] text-[#de1819] border-none px-6 py-3 rounded-xl font-bold cursor-pointer hover:from-[#ffd966] hover:to-[#ffc53a] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    title="Login as admin"
                    onClick={handleAdminLogin}
                  >
                    Admin Login
                  </button>
                  <button
                    id="studentLoginBtn"
                    className="bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-white/20 hover:border-white/60 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    title="Login as student"
                    onClick={handleStudentLogin}
                  >
                    Student Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Announcements */}
        <section className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-[#fafafa]">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-10">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-3 text-[#292929]">
                Recent Announcements
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-[#de1819] hover:scale-105">
                <div className="text-3xl mb-3">⚙️</div>
                <strong className="text-xl text-[#292929] block mb-2">Scheduled Maintenance</strong>
                <div className="text-sm text-[#545454] leading-relaxed">
                  Hostel water supply will be suspended on 6 Nov for maintenance.
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-[#de1819] hover:scale-105">
                <div className="text-3xl mb-3">🧹</div>
                <strong className="text-xl text-[#292929] block mb-2">Clean Campus Drive</strong>
                <div className="text-sm text-[#545454] leading-relaxed">
                  Join volunteers this Friday in the main quadrangle.
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-[#de1819] hover:scale-105">
                <div className="text-3xl mb-3">📊</div>
                <strong className="text-xl text-[#292929] block mb-2">Report Export</strong>
                <div className="text-sm text-[#545454] leading-relaxed">
                  Admins can export complaint analytics as PDF / Excel now.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
