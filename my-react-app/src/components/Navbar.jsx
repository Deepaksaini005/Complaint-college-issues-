import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#c01516] to-[#de1819] text-white shadow-xl box-border">
      <div className="mx-auto box-border">
        <div className="flex items-center justify-between gap-4 lg:gap-6 py-5 lg:py-6 min-h-[70px] box-border">
          {/* Brand Section */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 box-border pl-6 sm:pl-8 md:pl-10 lg:pl-12 xl:pl-16 2xl:pl-20">
            <Link
              to="/"
              className="font-['Playfair_Display'] font-extrabold text-2xl sm:text-3xl tracking-tight text-white hover:text-[#ffc53a] transition-all duration-300 no-underline drop-shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#de1819] rounded-md box-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Campus Care
            </Link>
            <div className="hidden xl:block text-xs text-white/90 font-medium tracking-wide uppercase box-border">
              Student Portal
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden bg-white/10 border border-white/30 text-white px-4 py-2.5 rounded-xl text-xl leading-none hover:bg-white/20 transition-all duration-200 active:scale-95 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border flex items-center justify-center min-w-[44px] min-h-[44px] mr-6 sm:mr-8 md:mr-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* Desktop Navigation - Centered Links */}
          <nav className="hidden lg:flex items-center flex-1 justify-center px-4 lg:px-8 box-border">
            <ul className="flex items-center gap-3 lg:gap-4 list-none m-0 p-0 box-border">
              <li className="box-border">
                <Link
                  to="/"
                  className={`inline-block px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-base lg:text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border whitespace-nowrap ${
                    isActive('/')
                      ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-xl scale-105 px-7 lg:px-8 py-3.5 lg:py-4'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:shadow-md'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="box-border">
                <Link
                  to="/complaints"
                  className={`inline-block px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-base lg:text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border whitespace-nowrap ${
                    isActive('/complaints')
                      ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-xl scale-105 px-7 lg:px-8 py-3.5 lg:py-4'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:shadow-md'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Complaints
                </Link>
              </li>
              <li className="box-border">
                <Link
                  to="/about"
                  className={`inline-block px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-base lg:text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border whitespace-nowrap ${
                    isActive('/about')
                      ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-xl scale-105 px-7 lg:px-8 py-3.5 lg:py-4'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:shadow-md'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li className="box-border">
                <Link
                  to="/contact"
                  className={`inline-block px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-base lg:text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border whitespace-nowrap ${
                    isActive('/contact')
                      ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-xl scale-105 px-7 lg:px-8 py-3.5 lg:py-4'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:shadow-md'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li className="box-border">
                <Link
                  to="/faq"
                  className={`inline-block px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-base lg:text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border whitespace-nowrap ${
                    isActive('/faq')
                      ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-xl scale-105 px-7 lg:px-8 py-3.5 lg:py-4'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:shadow-md'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </li>
              <li className="box-border">
                <Link
                  to="/policy"
                  className={`inline-block px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-base lg:text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border whitespace-nowrap ${
                    isActive('/policy')
                      ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-xl scale-105 px-7 lg:px-8 py-3.5 lg:py-4'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:shadow-md'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Policy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side Auth Buttons */}
          <div className="hidden lg:flex gap-3 lg:gap-4 items-center flex-shrink-0 box-border ml-auto pr-6 sm:pr-8 md:pr-10 lg:pr-12 xl:pr-16 2xl:pr-20">
            <Link
              to="/login"
              className={`px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-sm lg:text-base font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] whitespace-nowrap box-border min-w-[90px] lg:min-w-[100px] text-center ${
                isActive('/login')
                  ? 'bg-white/20 border-2 border-[#ffc53a] text-white shadow-lg'
                  : 'bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:shadow-lg hover:scale-105'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-6 lg:px-7 py-3 lg:py-3.5 rounded-xl text-sm lg:text-base font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap box-border min-w-[100px] lg:min-w-[110px] text-center ${
                isActive('/signup')
                  ? 'bg-[#ffc53a] text-[#de1819] shadow-xl scale-105'
                  : 'bg-gradient-to-r from-[#ffc53a] to-[#ffd966] text-[#de1819] hover:from-[#ffd966] hover:to-[#ffc53a] shadow-lg hover:shadow-xl hover:scale-105'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-[#de1819] to-[#c01516] border-t-2 border-white/20 shadow-2xl box-border">
            <div className="px-6 py-5 space-y-3 box-border">
              <Link
                to="/"
                className={`block px-5 py-3 rounded-xl text-white transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border ${
                  isActive('/')
                    ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/complaints"
                className={`block px-5 py-3 rounded-xl text-white transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border ${
                  isActive('/complaints')
                    ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Complaints
              </Link>
              <Link
                to="/about"
                className={`block px-5 py-3 rounded-xl text-white transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border ${
                  isActive('/about')
                    ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`block px-5 py-3 rounded-xl text-white transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border ${
                  isActive('/contact')
                    ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className={`block px-5 py-3 rounded-xl text-white transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border ${
                  isActive('/faq')
                    ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/policy"
                className={`block px-5 py-3 rounded-xl text-white transition-all duration-300 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border ${
                  isActive('/policy')
                    ? 'bg-[#ffc53a] text-[#de1819] font-bold shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Policy
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t-2 border-white/20 mt-4 space-y-3 box-border">
                <Link
                  to="/login"
                  className="block px-5 py-3 rounded-xl text-white bg-white/15 border-2 border-[#ffc53a]/50 text-center hover:bg-white/25 hover:border-[#ffc53a] transition-all duration-300 font-bold shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc53a] box-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-5 py-3 rounded-xl bg-gradient-to-r from-[#ffc53a] to-[#ffd966] text-[#de1819] font-bold text-center hover:from-[#ffd966] hover:to-[#ffc53a] transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white box-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar