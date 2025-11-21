import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#c01516] via-[#de1819] to-[#c01516] text-white mt-auto border-t-4 border-[#ffc53a]/30">
      <div className="mx-auto py-16 max-w-[1400px]">
        <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <h3 className="font-['Playfair_Display'] font-extrabold text-3xl text-white drop-shadow-lg">
              Campus Care
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Your one-stop portal to log, track and resolve campus facility issues. Empowering
              students and administration through seamless communication.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-['Work_Sans'] font-bold text-lg text-[#ffc53a] mb-3 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → Home
                </Link>
              </li>
              <li>
                <Link
                  to="/complaints"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → Complaints
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h4 className="font-['Work_Sans'] font-bold text-lg text-[#ffc53a] mb-3 uppercase tracking-wide">
              Support
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/policy"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-sm text-white/90 hover:text-[#ffc53a] transition-all duration-300 inline-block hover:translate-x-2 font-medium"
                >
                  → Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h4 className="font-['Work_Sans'] font-bold text-lg text-[#ffc53a] mb-3 uppercase tracking-wide">
              Contact Info
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-white/90 mb-0">
                <strong className="text-white block mb-1">Email:</strong>
                <a
                  href="mailto:support@campuscare.in"
                  className="text-white/90 hover:text-[#ffc53a] transition-colors duration-300 underline"
                >
                  support@campuscare.in
                </a>
              </p>
              <p className="text-sm text-white/90 mb-0">
                <strong className="text-white block mb-1">Phone:</strong>
                <a
                  href="tel:+919876543210"
                  className="text-white/90 hover:text-[#ffc53a] transition-colors duration-300 underline"
                >
                  +91 98765 43210
                </a>
              </p>
              <p className="text-sm text-white/90 mb-0">
                <strong className="text-white block mb-1">Office:</strong>
                <span className="text-white/90">Student Services, Main Admin Block</span>
              </p>
            </div>
          </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t-2 border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/90 font-medium">
              © 2025 Campus Care — Built to improve campus facilities
            </div>
            <div className="text-sm text-white/80 flex items-center gap-2">
              Made with <span className="text-red-300">❤️</span> for students
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
