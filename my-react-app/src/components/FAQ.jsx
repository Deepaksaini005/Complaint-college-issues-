import Navbar from './Navbar'
import Footer from './Footer'

function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fafafa] to-white text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <section id="faq" className="space-y-6">
            <div className="mb-10">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-3 text-[#292929]">
                Frequently Asked Questions
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full"></div>
              <p className="text-[#545454] text-base sm:text-lg mt-4">
                Find answers to common questions about Campus Care
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-[#de1819] hover:scale-[1.02]">
                <h4 className="m-0 mb-3 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">❓</span>
                  How do I file a complaint?
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed ml-11">
                  Login → New Complaint → Fill details and submit. You can attach a photo for better
                  context.
                </p>
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-[#ffc53a] hover:scale-[1.02]">
                <h4 className="m-0 mb-3 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  How can I check my complaint status?
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed ml-11">
                  Go to Complaints → My Complaints (after login) to check status and updates in
                  real-time.
                </p>
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-[#de1819] hover:scale-[1.02]">
                <h4 className="m-0 mb-3 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  What if I forget my password?
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed ml-11">
                  Use the "Forgot Password" flow on the login page (demo: reset via email flow is
                  mocked).
                </p>
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-[#ffc53a] hover:scale-[1.02]">
                <h4 className="m-0 mb-3 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  How long does it take to resolve a complaint?
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed ml-11">
                  Resolution time varies by category. Urgent issues are typically addressed within
                  24-48 hours, while routine maintenance may take 3-5 business days.
                </p>
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-[#de1819] hover:scale-[1.02]">
                <h4 className="m-0 mb-3 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">✏️</span>
                  Can I edit or delete my complaint after submission?
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed ml-11">
                  You can edit complaints that are still pending. Once assigned or in progress,
                  contact support for modifications.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FAQ
