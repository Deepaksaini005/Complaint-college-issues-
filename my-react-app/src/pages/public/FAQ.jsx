import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FAQSection from '../../components/FAQSection'

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

            {/* Dynamic FAQ list powered by backend (same as student dashboard) */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
              <FAQSection />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FAQ
