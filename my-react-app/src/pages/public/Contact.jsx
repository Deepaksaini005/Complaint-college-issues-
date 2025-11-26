import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill all fields')
      return
    }

    // Store to localStorage (demo)
    const tickets = JSON.parse(localStorage.getItem('campuscare_tickets') || '[]')
    tickets.unshift({
      id: 'T' + Date.now(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      msg: formData.message,
      date: new Date().toISOString()
    })
    localStorage.setItem('campuscare_tickets', JSON.stringify(tickets))
    alert('Message sent — (demo) we stored it locally.')
    setFormData({ name: '', email: '', subject: '', message: '' })
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
          <section id="contact" className="space-y-10">
            <div className="mb-10">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-3 text-[#292929]">
                Contact Us
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full"></div>
              <p className="text-[#545454] text-base sm:text-lg mt-4">
                Have a question or need assistance? Get in touch with us
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-[#292929]">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      name="subject"
                      type="text"
                      placeholder="Subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] hover:border-[#de1819]/50"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#545454] text-sm uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      placeholder="How can we help?"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border-2 border-[#e6e6e6] focus:border-[#de1819] focus:ring-4 focus:ring-[#de1819]/20 outline-none transition-all duration-300 font-['Montserrat'] resize-none hover:border-[#de1819]/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#ffc53a] to-[#ffd966] text-[#de1819] border-none px-8 py-4 rounded-xl font-bold cursor-pointer hover:from-[#ffd966] hover:to-[#ffc53a] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl w-full"
                  >
                    Send Message
                  </button>
                </form>
              </div>
              <div className="bg-gradient-to-br from-white to-[#fafafa] rounded-2xl p-8 lg:p-10 shadow-xl border-2 border-[#ffc53a]/20">
                <h3 className="text-2xl font-bold mb-6 text-[#292929]">Contact Information</h3>
                <p className="text-sm text-[#545454] mb-8 leading-relaxed">
                  For queries or assistance reach out to us through any of the following channels:
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#de1819] to-[#c01516] rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      ✉️
                    </div>
                    <div>
                      <strong className="text-[#292929] block mb-1">Email</strong>
                      <a
                        href="mailto:support@campuscare.in"
                        className="text-[#de1819] hover:text-[#ffc53a] transition-colors duration-300 text-base font-medium"
                      >
                        support@campuscare.in
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ffc53a] to-[#ffd966] rounded-xl flex items-center justify-center text-[#de1819] text-xl flex-shrink-0">
                      📞
                    </div>
                    <div>
                      <strong className="text-[#292929] block mb-1">Phone</strong>
                      <a
                        href="tel:+919876543210"
                        className="text-[#de1819] hover:text-[#ffc53a] transition-colors duration-300 text-base font-medium"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#de1819] to-[#c01516] rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      🏢
                    </div>
                    <div>
                      <strong className="text-[#292929] block mb-1">Office</strong>
                      <p className="text-[#545454] text-base m-0">
                        Student Services, Main Admin Block
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
