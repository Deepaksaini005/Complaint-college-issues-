import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { adminAPI } from '../../services/apiClient'
import './DepartmentStatus.css'

const DepartmentStatus = ({ onLogout, userRole = 'admin' }) => {
  const navigate = useNavigate()
  const [departmentStatus, setDepartmentStatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDepartmentStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDepartmentStatus()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchDepartmentStatus = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getDepartmentStatus()
      
      // Define all departments in the order we want to display
      const allDepartments = ['Hostel', 'Maintenance', 'Cafeteria', 'Library', 'Transport']
      
      // Create a map of received data from backend
      const dataMap = {}
      data.forEach(dept => {
        const deptName = dept._id || 'Unassigned'
        dataMap[deptName] = dept
      })
      
      // Map all departments with their stats - ensure all 5 main departments are shown
      const mappedStatus = allDepartments.map(deptName => {
        const dept = dataMap[deptName] || {}
        const total = dept.total || 0
        const resolved = dept.resolved || 0
        const pending = dept.registered || 0
        const inProgress = dept.inProgress || 0
        const notSolved = total - resolved
        const solvedPercentage = total > 0 ? parseFloat(((resolved / total) * 100).toFixed(1)) : 0
        
        return {
          department: deptName,
          total,
          pending,
          inProgress,
          resolved,
          solvedPercentage,
          notSolved
        }
      })
      
      // Also add "Pending Assignment" if it exists in the data
      if (dataMap['Pending Assignment']) {
        const pendingDept = dataMap['Pending Assignment']
        mappedStatus.push({
          department: 'Pending Assignment',
          total: pendingDept.total || 0,
          pending: pendingDept.registered || 0,
          inProgress: pendingDept.inProgress || 0,
          resolved: pendingDept.resolved || 0,
          solvedPercentage: 0,
          notSolved: (pendingDept.total || 0) - (pendingDept.resolved || 0)
        })
      }
      
      setDepartmentStatus(mappedStatus)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch department status')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 70) return '#10b981'
    if (percentage >= 40) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="department-status-page">
      <AdminSidebar userRole={userRole} />
      
      <div className="status-wrapper">
        <header className="status-header">
          <div className="header-content">
            <div>
              <h1>Department Status Overview</h1>
              <p className="header-subtitle">
                Track complaint resolution status across all departments
              </p>
            </div>
            <div className="header-actions">
              <button 
                className="refresh-btn" 
                onClick={fetchDepartmentStatus}
                title="Refresh Status"
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

        <div className="status-content">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}
          {loading ? (
            <div className="loading-state">
              <p>Loading department status...</p>
            </div>
          ) : (
            <div className="status-grid">
            {departmentStatus.length === 0 ? (
              <div className="no-data">
                <p>No department data available</p>
              </div>
            ) : (
              departmentStatus.map((dept, index) => (
              <div key={index} className="status-card">
                <div className="status-card-header">
                  <h2>{dept.department}</h2>
                  <span className="total-badge">{dept.total} Total</span>
                </div>

                <div className="status-stats">
                  <div className="stat-item resolved">
                    <div className="stat-icon">
                      <i className="bx bx-check-circle"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{dept.resolved}</span>
                      <span className="stat-label">Resolved</span>
                    </div>
                  </div>

                  <div className="stat-item not-solved">
                    <div className="stat-icon">
                      <i className="bx bx-x-circle"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{dept.notSolved}</span>
                      <span className="stat-label">Not Solved</span>
                    </div>
                  </div>
                </div>

                <div className="status-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Pending:</span>
                    <span className="breakdown-value pending">{dept.pending}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">In Progress:</span>
                    <span className="breakdown-value in-progress">{dept.inProgress}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Resolved:</span>
                    <span className="breakdown-value resolved">{dept.resolved}</span>
                  </div>
                </div>

                <div className="status-progress">
                  <div className="progress-header">
                    <span>Resolution Rate</span>
                    <span className="progress-percentage" style={{ color: getStatusColor(dept.solvedPercentage) }}>
                      {dept.total > 0 ? `${dept.solvedPercentage}%` : 'N/A'}
                    </span>
                  </div>
                  {dept.total > 0 ? (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${dept.solvedPercentage}%`,
                          backgroundColor: getStatusColor(dept.solvedPercentage)
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="progress-bar" style={{ backgroundColor: '#e5e7eb' }}>
                      <div className="progress-fill" style={{ width: '0%' }}></div>
                    </div>
                  )}
                </div>

                <button
                  className="view-complaints-btn"
                  onClick={() => {
                    // Filter complaints by department when navigating
                    navigate(`/admin/complaints?department=${dept.department}`)
                  }}
                >
                  <i className="bx bx-list-ul"></i>
                  View {dept.department} Complaints
                </button>
              </div>
            ))
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DepartmentStatus

