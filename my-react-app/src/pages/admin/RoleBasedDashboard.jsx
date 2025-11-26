import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import './AdminDashboard.css'

const RoleBasedDashboard = ({ userRole, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate(`/admin/${userRole.toLowerCase().replace(' admin', '')}/login`)
  }

  const getDepartmentData = () => {
    const role = userRole.toLowerCase()
    if (role.includes('hostel')) {
      return {
        title: 'Hostel Management Dashboard',
        description: 'Manage hostel accommodations and resident services',
        stats: [
          { label: 'Total Rooms', value: '450', icon: 'bx-home' },
          { label: 'Occupied', value: '380', icon: 'bx-user' },
          { label: 'Available', value: '70', icon: 'bx-check-circle' },
          { label: 'Complaints', value: '23', icon: 'bx-message-alt-error' }
        ]
      }
    } else if (role.includes('maintenance')) {
      return {
        title: 'Maintenance Management Dashboard',
        description: 'Manage maintenance requests and facility services',
        stats: [
          { label: 'Active Requests', value: '45', icon: 'bx-wrench' },
          { label: 'In Progress', value: '28', icon: 'bx-loader-circle' },
          { label: 'Completed', value: '120', icon: 'bx-check' },
          { label: 'Pending', value: '17', icon: 'bx-time' }
        ]
      }
    } else if (role.includes('cafeteria')) {
      return {
        title: 'Cafeteria Management Dashboard',
        description: 'Manage cafeteria services and food quality',
        stats: [
          { label: 'Daily Orders', value: '850', icon: 'bx-food-menu' },
          { label: 'Active Menu Items', value: '45', icon: 'bx-restaurant' },
          { label: 'Complaints', value: '12', icon: 'bx-message-alt-error' },
          { label: 'Rating', value: '4.2/5', icon: 'bx-star' }
        ]
      }
    } else if (role.includes('library')) {
      return {
        title: 'Library Management Dashboard',
        description: 'Manage library resources and services',
        stats: [
          { label: 'Total Books', value: '25,000', icon: 'bx-book' },
          { label: 'Issued', value: '1,250', icon: 'bx-book-open' },
          { label: 'Available', value: '23,750', icon: 'bx-check-circle' },
          { label: 'Complaints', value: '8', icon: 'bx-message-alt-error' }
        ]
      }
    } else if (role.includes('transport')) {
      return {
        title: 'Transport Management Dashboard',
        description: 'Manage transport services and bus routes',
        stats: [
          { label: 'Active Routes', value: '12', icon: 'bx-map' },
          { label: 'Buses', value: '25', icon: 'bx-bus' },
          { label: 'Daily Passengers', value: '1,200', icon: 'bx-user' },
          { label: 'Complaints', value: '15', icon: 'bx-message-alt-error' }
        ]
      }
    }
    return null
  }

  const departmentData = getDepartmentData()

  if (!departmentData) {
    return <div>Invalid role</div>
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar userRole={userRole} />
      
      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>{departmentData.title}</h1>
              <p className="dashboard-subtitle">
                {departmentData.description}
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

        <div className="dashboard-content">
          <div className="summary-cards">
            {departmentData.stats.map((stat, index) => (
              <div key={index} className="summary-card total">
                <div className="card-icon">
                  <i className={`bx ${stat.icon}`}></i>
                </div>
                <div className="card-content">
                  <h3>{stat.label}</h3>
                  <p className="card-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-card full-width">
            <div className="chart-header">
              <h2>Department Overview</h2>
              <p className="chart-subtitle">
                Quick access to manage {userRole.toLowerCase().replace(' admin', '')} related complaints and services
              </p>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
                Use the sidebar to navigate to View Complaints and manage your department's activities.
              </p>
              <button
                className="secure-btn"
                onClick={() => navigate('/admin/complaints')}
                style={{ maxWidth: '300px', margin: '0 auto' }}
              >
                <i className="bx bx-list-ul" style={{ marginRight: '0.5rem' }}></i>
                View Department Complaints
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleBasedDashboard

