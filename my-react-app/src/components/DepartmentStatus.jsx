import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './DepartmentStatus.css'

const DepartmentStatus = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  
  // Mock data - in real app, this would come from API
  const departmentStatus = [
    {
      department: 'Hostel',
      total: 89,
      pending: 23,
      inProgress: 45,
      resolved: 21,
      solvedPercentage: 23.6,
      notSolved: 68
    },
    {
      department: 'Maintenance',
      total: 67,
      pending: 12,
      inProgress: 28,
      resolved: 27,
      solvedPercentage: 40.3,
      notSolved: 40
    },
    {
      department: 'Cafeteria',
      total: 45,
      pending: 8,
      inProgress: 15,
      resolved: 22,
      solvedPercentage: 48.9,
      notSolved: 23
    },
    {
      department: 'Library',
      total: 28,
      pending: 5,
      inProgress: 10,
      resolved: 13,
      solvedPercentage: 46.4,
      notSolved: 15
    },
    {
      department: 'Transport',
      total: 18,
      pending: 3,
      inProgress: 7,
      resolved: 8,
      solvedPercentage: 44.4,
      notSolved: 10
    }
  ]

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
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="status-content">
          <div className="status-grid">
            {departmentStatus.map((dept, index) => (
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
                      {dept.solvedPercentage}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${dept.solvedPercentage}%`,
                        backgroundColor: getStatusColor(dept.solvedPercentage)
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  className="view-complaints-btn"
                  onClick={() => navigate('/admin/complaints')}
                >
                  <i className="bx bx-list-ul"></i>
                  View Department Complaints
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentStatus

