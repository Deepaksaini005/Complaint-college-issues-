import { useNavigate, useLocation } from 'react-router-dom'
import './AdminSidebar.css'

const AdminSidebar = ({ userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bx-grid-alt',
      path: '/admin/dashboard',
      roles: ['Super Admin', 'Hostel Admin', 'Maintenance Admin', 'Cafeteria Admin', 'Library Admin', 'Transport Admin']
    },
    {
      id: 'complaints',
      label: 'View Complaints',
      icon: 'bx-list-ul',
      path: '/admin/complaints',
      roles: ['Super Admin', 'Hostel Admin', 'Maintenance Admin', 'Cafeteria Admin', 'Library Admin', 'Transport Admin']
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bx-bell',
      path: '/admin/notifications',
      roles: ['Super Admin', 'Hostel Admin', 'Maintenance Admin', 'Cafeteria Admin', 'Library Admin', 'Transport Admin']
    },
    {
      id: 'admin-management',
      label: 'Admin Management',
      icon: 'bx-user-plus',
      path: '/admin/manage',
      roles: ['Super Admin'] // Only Super Admin can access
    },
    {
      id: 'department-status',
      label: 'Department Status',
      icon: 'bx-building-house',
      path: '/admin/department-status',
      roles: ['Super Admin'] // Only Super Admin can access
    },
    {
      id: 'notice-management',
      label: 'Notice Management',
      icon: 'bx-note',
      path: '/admin/notice-management',
      roles: ['Super Admin'] // Only Super Admin can access
    },
    {
      id: 'user-details',
      label: 'User Details',
      icon: 'bx-group',
      path: '/admin/user-details',
      roles: ['Super Admin'] // Only Super Admin can access
    },
    {
      id: 'faq-management',
      label: 'FAQ Management',
      icon: 'bx-help-circle',
      path: '/admin/faq-management',
      roles: ['Super Admin'] // Only Super Admin can access
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const canAccess = (item) => {
    return item.roles.includes(userRole)
  }

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="bx bx-shield-quarter"></i>
          <h2>Campus Care</h2>
        </div>
        <div className="user-role-badge">
          <i className="bx bx-user-circle"></i>
          <span>{userRole}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map(item => {
            if (!canAccess(item)) return null
            
            return (
              <li key={item.id}>
                <button
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <i className={`bx ${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="footer-title">Admin Portal</p>
          <p className="footer-subtitle">Campus Management System</p>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar

