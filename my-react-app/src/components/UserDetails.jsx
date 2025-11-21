import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './UserDetails.css'

const UserDetails = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  
  // Mock user data - in real app, this would come from API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      studentId: 'STU001',
      email: 'rajesh.kumar@student.campus.edu',
      phone: '+91 9876543210',
      course: 'B.Tech Computer Science',
      year: '3rd Year',
      hostel: 'Block A, Room 205',
      status: 'Active',
      lastLogin: '2024-01-17 10:30 AM',
      complaintsSubmitted: 3,
      registeredAt: '2023-08-15'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      studentId: 'STU002',
      email: 'priya.sharma@student.campus.edu',
      phone: '+91 9876543211',
      course: 'B.Tech Electronics',
      year: '2nd Year',
      hostel: 'Block B, Room 312',
      status: 'Active',
      lastLogin: '2024-01-17 09:15 AM',
      complaintsSubmitted: 2,
      registeredAt: '2023-08-20'
    },
    {
      id: 3,
      name: 'Amit Singh',
      studentId: 'STU003',
      email: 'amit.singh@student.campus.edu',
      phone: '+91 9876543212',
      course: 'B.Tech Mechanical',
      year: '4th Year',
      hostel: null,
      status: 'Active',
      lastLogin: '2024-01-16 04:20 PM',
      complaintsSubmitted: 1,
      registeredAt: '2022-08-10'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      studentId: 'STU004',
      email: 'sneha.patel@student.campus.edu',
      phone: '+91 9876543213',
      course: 'B.Tech Civil',
      year: '1st Year',
      hostel: 'Block C, Room 108',
      status: 'Active',
      lastLogin: '2024-01-17 11:45 AM',
      complaintsSubmitted: 1,
      registeredAt: '2024-08-01'
    },
    {
      id: 5,
      name: 'Vikram Reddy',
      studentId: 'STU005',
      email: 'vikram.reddy@student.campus.edu',
      phone: '+91 9876543214',
      course: 'MBA',
      year: '2nd Year',
      hostel: null,
      status: 'Inactive',
      lastLogin: '2024-01-10 02:00 PM',
      complaintsSubmitted: 2,
      registeredAt: '2023-08-15'
    }
  ])

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    year: ''
  })
  const [filteredUsers, setFilteredUsers] = useState(users)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    let filtered = [...users]

    if (filters.search) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.studentId.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.status) {
      filtered = filtered.filter(u => u.status === filters.status)
    }

    if (filters.year) {
      filtered = filtered.filter(u => u.year === filters.year)
    }

    setFilteredUsers(filtered)
  }, [filters, users])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  return (
    <div className="user-details-page">
      <AdminSidebar userRole={userRole} />
      
      <div className="user-wrapper">
        <header className="user-header">
          <div className="header-content">
            <div>
              <h1>User Details</h1>
              <p className="header-subtitle">
                View and manage all student user accounts
              </p>
            </div>
            <div className="header-actions">
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="user-content">
          {/* Filters */}
          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search by name, ID, or email"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className="filter-group">
                <button
                  className="clear-filters-btn"
                  onClick={() => setFilters({ search: '', status: '', year: '' })}
                >
                  <i className="bx bx-x"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            <div className="table-header">
              <h2>All Users ({filteredUsers.length})</h2>
            </div>

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Hostel</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Complaints</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="no-data">
                        No users found matching the filters
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>
                          <strong>{user.name}</strong>
                        </td>
                        <td>{user.studentId}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.course}</td>
                        <td>{user.year}</td>
                        <td>
                          {user.hostel || <span className="not-applicable">N/A</span>}
                        </td>
                        <td>
                          <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.lastLogin}</td>
                        <td>
                          <span className="complaints-count">{user.complaintsSubmitted}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails

