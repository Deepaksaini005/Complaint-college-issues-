import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function ComplaintsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filteredComplaints, setFilteredComplaints] = useState([
    {
      id: 'C001',
      title: 'Water leakage in hostel washroom',
      category: 'Plumbing',
      status: 'Pending',
      date: '2025-11-03'
    },
    {
      id: 'C002',
      title: 'Streetlight not working near block A',
      category: 'Electricity',
      status: 'Resolved',
      date: '2025-11-01'
    },
    {
      id: 'C003',
      title: 'Unclean corridors in hostel',
      category: 'Cleaning',
      status: 'In Progress',
      date: '2025-10-29'
    },
    {
      id: 'C004',
      title: 'Sporadic Wi-Fi disconnects',
      category: 'Hostel',
      status: 'Pending',
      date: '2025-10-27'
    }
  ])

  useEffect(() => {
    // Get filters from location state if coming from homepage
    if (location.state) {
      setSearchQuery(location.state.search || '')
      setCategoryFilter(location.state.category || '')
      setStatusFilter(location.state.status || '')
    }
  }, [location])

  useEffect(() => {
    filterComplaints()
  }, [searchQuery, categoryFilter, statusFilter])

  const filterComplaints = () => {
    // In a real app, this would filter from API
    // For now, we'll just show all complaints
  }

  const getStatusClass = (status) => {
    if (status === 'Resolved') return 'bg-[#28a745] text-white'
    if (status === 'In Progress') return 'bg-[#007bff] text-white'
    return 'bg-[#ffa500] text-white'
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#292929] font-['Montserrat'] w-full">
      <Navbar />

      <main className="flex-1 w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <section id="complaints" className="space-y-6">
            <div>
              <h2 className="font-['Work_Sans'] font-extrabold text-2xl sm:text-3xl m-0 mb-2 border-l-4 border-[#de1819] pl-4 text-[#292929]">
                Complaint Search & Management
              </h2>
              <p className="text-[#545454] text-sm sm:text-base mt-2">
                Search and filter complaints from the last 90 days
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 lg:p-6 shadow-md">
              <div className="flex flex-wrap gap-4 items-center">
                <input
                  id="searchInput"
                  type="text"
                  placeholder="Search by ID or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 text-sm font-['Montserrat']"
                />
                <select
                  id="categoryFilter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 text-sm font-['Montserrat'] min-w-[180px]"
                >
                  <option value="">All Categories</option>
                  <option>Hostel</option>
                  <option>Electricity</option>
                  <option>Plumbing</option>
                  <option>Cleaning</option>
                </select>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#de1819] focus:ring-2 focus:ring-[#de1819]/20 outline-none transition-all duration-200 text-sm font-['Montserrat'] min-w-[180px]"
                >
                  <option value="">All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <div className="ml-auto text-sm text-[#545454] hidden sm:block">
                  Showing complaints from last 90 days
                </div>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#de1819] text-white">
                    <th className="px-4 py-4 text-left font-['Work_Sans'] font-extrabold text-sm">
                      Complaint ID
                    </th>
                    <th className="px-4 py-4 text-left font-['Work_Sans'] font-extrabold text-sm">
                      Title
                    </th>
                    <th className="px-4 py-4 text-left font-['Work_Sans'] font-extrabold text-sm">
                      Category
                    </th>
                    <th className="px-4 py-4 text-left font-['Work_Sans'] font-extrabold text-sm">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left font-['Work_Sans'] font-extrabold text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint, index) => (
                    <tr
                      key={complaint.id}
                      className={`border-b border-[#f2f2f2] hover:bg-[#f9f9f9] transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#fbfbfb]'
                      }`}
                    >
                      <td className="px-4 py-4 text-sm font-medium">{complaint.id}</td>
                      <td className="px-4 py-4 text-sm">{complaint.title}</td>
                      <td className="px-4 py-4 text-sm">{complaint.category}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-lg text-white font-bold text-xs ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{complaint.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ComplaintsPage
