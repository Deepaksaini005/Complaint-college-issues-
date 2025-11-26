import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function Policy() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fafafa] to-white text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <section id="policy" className="space-y-8">
            <div className="mb-10">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-3 text-[#292929]">
                Privacy Policy & Terms
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full"></div>
              <p className="text-[#545454] text-base sm:text-lg mt-4">
                Your privacy and data security are important to us
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl space-y-8">
              <div className="border-l-4 border-[#de1819] pl-6">
                <h4 className="m-0 mb-4 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  Data Collection
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  We collect name, email, complaint data and relevant attachments to resolve issues.
                  Data is used internally and not shared without consent.
                </p>
              </div>

              <div className="border-l-4 border-[#ffc53a] pl-6">
                <h4 className="m-0 mb-4 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  Usage Policy
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  Users must submit accurate complaints. Abuse or false reports may lead to account
                  action.
                </p>
              </div>

              <div className="border-l-4 border-[#de1819] pl-6">
                <h4 className="m-0 mb-4 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  Consent
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  By using Campus Care you consent to this policy (demo). For production you must
                  show an explicit consent checkbox at signup.
                </p>
              </div>

              <div className="border-l-4 border-[#ffc53a] pl-6">
                <h4 className="m-0 mb-4 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  Data Security
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  We implement industry-standard security measures to protect your personal
                  information and complaint data from unauthorized access.
                </p>
              </div>

              <div className="border-l-4 border-[#de1819] pl-6">
                <h4 className="m-0 mb-4 text-xl font-bold text-[#292929] flex items-center gap-3">
                  <span className="text-2xl">⚖️</span>
                  User Rights
                </h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  You have the right to access, modify, or delete your personal data and complaint
                  records at any time by contacting support.
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

export default Policy
