import { useNavigate, useLocation } from 'react-router-dom'
import './AdminSidebar.css'

const AdminSidebar = ({ userRole = 'admin' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Map backend roles to display names
  const roleDisplayMap = {
    'admin': 'Super Admin',
    'hostel': 'Hostel Admin',
    'maintenance': 'Maintenance Admin',
    'cafeteria': 'Cafeteria Admin',
    'library': 'Library Admin',
    'transport': 'Transport Admin'
  }

  const displayRole = roleDisplayMap[userRole] || userRole

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bx-grid-alt',
      path: '/admin/dashboard',
      roles: ['admin', 'hostel', 'maintenance', 'cafeteria', 'library', 'transport']
    },
    {
      id: 'complaints',
      label: 'View Complaints',
      icon: 'bx-list-ul',
      path: '/admin/complaints',
      roles: ['admin', 'hostel', 'maintenance', 'cafeteria', 'library', 'transport']
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bx-bell',
      path: '/admin/notifications',
      roles: ['admin', 'hostel', 'maintenance', 'cafeteria', 'library', 'transport']
    },
    {
      id: 'admin-management',
      label: 'Admin Management',
      icon: 'bx-user-plus',
      path: '/admin/manage',
      roles: ['admin'] // Only admin can access
    },
    {
      id: 'department-status',
      label: 'Department Status',
      icon: 'bx-building-house',
      path: '/admin/department-status',
      roles: ['admin'] // Only admin can access
    },
    {
      id: 'notice-management',
      label: 'Notice Management',
      icon: 'bx-note',
      path: '/admin/notice-management',
      roles: ['admin'] // Only admin can access
    },
    {
      id: 'user-details',
      label: 'User Details',
      icon: 'bx-group',
      path: '/admin/user-details',
      roles: ['admin'] // Only admin can access
    },
    {
      id: 'faq-management',
      label: 'FAQ Management',
      icon: 'bx-help-circle',
      path: '/admin/faq-management',
      roles: ['admin'] // Only admin can access
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
          <span>{displayRole}</span>
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

