import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { adminAPI, complaintAPI } from '../../services/apiClient'
import './UserDetails.css'

const UserDetails = ({ onLogout, userRole = 'admin' }) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [complaintCounts, setComplaintCounts] = useState({})

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: ''
  })
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    fetchUsers()
    
    // Auto-refresh every 30 seconds to get latest users
    const interval = setInterval(() => {
      fetchUsers()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [usersData, complaintsData] = await Promise.all([
        adminAPI.getAllUsers(),
        complaintAPI.adminList().catch(() => []) // If complaints fail, use empty array
      ])
      
      // Filter only students
      const students = usersData.filter(user => user.role === 'student')
      
      // Count complaints per user
      const counts = {}
      if (Array.isArray(complaintsData)) {
        complaintsData.forEach(complaint => {
          const studentId = complaint.student?._id || complaint.student?.id || complaint.student
          if (studentId) {
            const idStr = studentId.toString()
            counts[idStr] = (counts[idStr] || 0) + 1
          }
        })
      }
      setComplaintCounts(counts)
      
      // Map users with complaint counts - sort by registration date (newest first)
      const mappedUsers = students
        .map(user => {
          const userId = user._id?.toString() || user.id?.toString() || ''
          const regNumber = user.registrationNumber || (userId ? userId.slice(-6).toUpperCase() : 'N/A')
          
          return {
            id: userId || user.id,
            name: user.name || 'N/A',
            studentId: regNumber,
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            course: user.department || 'General',
            year: 'N/A',
            hostel: null,
            status: 'Active',
            lastLogin: 'N/A',
            complaintsSubmitted: counts[userId] || 0,
            registeredAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
            department: user.department || 'General',
            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(0)
          }
        })
        .sort((a, b) => b.createdAt - a.createdAt) // Sort by newest first
      
      setUsers(mappedUsers)
      setFilteredUsers(mappedUsers)
    } catch (err) {
      setError(err.message || 'Failed to fetch users')
      setUsers([])
      setFilteredUsers([])
    } finally {
      setLoading(false)
    }
  }

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

    if (filters.department) {
      filtered = filtered.filter(u => u.department === filters.department)
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
              <button 
                className="refresh-btn" 
                onClick={fetchUsers}
                title="Refresh Users"
                style={{ 
                  marginRight: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#CD201F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <i className="bx bx-refresh"></i>
                Refresh
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="user-content">
          {error && (
            <div className="error-banner" style={{ 
              padding: '12px', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {loading ? (
            <div className="loading-state" style={{ 
              padding: '40px', 
              textAlign: 'center' 
            }}>
              <p>Loading users...</p>
            </div>
          ) : (
            <>
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
                <label>Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="filter-group">
                <button
                  className="clear-filters-btn"
                  onClick={() => setFilters({ search: '', status: '', department: '' })}
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
              <h2>All Users ({filteredUsers.length} / {users.length} total)</h2>
              {users.length === 0 && !loading && (
                <p style={{ color: '#666', marginTop: '10px' }}>
                  No users found. Make sure students have registered.
                </p>
              )}
            </div>

            <div className="users-table-wrapper" style={{ 
              background: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <table className="users-table" style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #CD201F 0%, #B34D3A 100%)',
                    color: 'white'
                  }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>#</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Registration Number</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Registered At</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Complaints</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data" style={{ 
                        padding: '40px', 
                        textAlign: 'center', 
                        color: '#666',
                        fontSize: '16px'
                      }}>
                        No users found matching the filters
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr 
                        key={user.id} 
                        style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <td style={{ padding: '16px', color: '#666', fontWeight: '500', fontFamily: 'monospace', fontSize: '13px' }}>
                          #{String(index + 1).padStart(3, '0')}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#1f2937', fontSize: '15px' }}>{user.name}</strong>
                        </td>
                        <td style={{ padding: '16px', color: '#4b5563', fontFamily: 'monospace' }}>
                          {user.studentId}
                        </td>
                        <td style={{ padding: '16px', color: '#4b5563' }}>{user.email}</td>
                        <td style={{ padding: '16px', color: '#4b5563' }}>{user.phone}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            background: '#f3f4f6',
                            color: '#374151',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {user.department}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`} style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', color: '#6b7280', fontSize: '13px' }}>
                          {user.registeredAt}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span className="complaints-count" style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: '#CD201F',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '13px',
                            minWidth: '30px'
                          }}>
                            {user.complaintsSubmitted}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetails

