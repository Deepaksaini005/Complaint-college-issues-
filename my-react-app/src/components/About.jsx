import Navbar from './Navbar'
import Footer from './Footer'

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fafafa] to-white text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <section id="about" className="space-y-12">
            <div className="mb-10">
              <h2 className="font-['Work_Sans'] font-extrabold text-3xl sm:text-4xl m-0 mb-3 text-[#292929]">
                About Campus Care
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#de1819] to-[#ffc53a] rounded-full"></div>
              <p className="text-[#545454] text-base sm:text-lg mt-4 max-w-2xl">
                Learn more about our mission, vision, and the team behind Campus Care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-[#de1819] hover:scale-105">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="m-0 mb-4 text-2xl font-bold text-[#292929]">Mission</h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  To improve campus living by connecting students and administration through
                  transparent complaint tracking and swift resolution.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-[#ffc53a] hover:scale-105">
                <div className="text-4xl mb-4">👁️</div>
                <h4 className="m-0 mb-4 text-2xl font-bold text-[#292929]">Vision</h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  A responsive, safe and well-maintained campus where student concerns are heard and
                  acted upon.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-[#de1819] hover:scale-105">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="m-0 mb-4 text-2xl font-bold text-[#292929]">Background</h4>
                <p className="text-base text-[#545454] m-0 leading-relaxed">
                  Campus Care was built as a final year project to streamline facility management
                  and student-admin communication.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="mb-8 text-2xl sm:text-3xl font-bold text-[#292929]">
                Development Team
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-white to-[#fafafa] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-2 border-transparent hover:border-[#ffc53a] hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#de1819] to-[#c01516] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    AT
                  </div>
                  <strong className="text-xl font-bold text-[#292929] block mb-2">
                    Ananya Thakur
                  </strong>
                  <div className="text-sm text-[#545454] font-medium">Team Lead & Backend</div>
                </div>
                <div className="bg-gradient-to-br from-white to-[#fafafa] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-2 border-transparent hover:border-[#ffc53a] hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ffc53a] to-[#ffd966] rounded-full mx-auto mb-4 flex items-center justify-center text-[#de1819] text-2xl font-bold">
                    FD
                  </div>
                  <strong className="text-xl font-bold text-[#292929] block mb-2">
                    Frontend Developer
                  </strong>
                  <div className="text-sm text-[#545454] font-medium">Frontend Dev</div>
                </div>
                <div className="bg-gradient-to-br from-white to-[#fafafa] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-2 border-transparent hover:border-[#ffc53a] hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#de1819] to-[#c01516] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    SK
                  </div>
                  <strong className="text-xl font-bold text-[#292929] block mb-2">
                    Simran Kaur
                  </strong>
                  <div className="text-sm text-[#545454] font-medium">DB Engineer</div>
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

export default About
