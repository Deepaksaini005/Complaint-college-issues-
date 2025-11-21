import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './AdminManagement.css'

const AdminManagement = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.hostel@campus.edu',
      role: 'Hostel Admin',
      department: 'Hostel',
      status: 'Active',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.maintenance@campus.edu',
      role: 'Maintenance Admin',
      department: 'Maintenance',
      status: 'Active',
      createdAt: '2024-01-12'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    department: ''
  })
  const [errors, setErrors] = useState({})

  const roles = [
    { value: 'Hostel Admin', label: 'Hostel Admin', department: 'Hostel' },
    { value: 'Maintenance Admin', label: 'Maintenance Admin', department: 'Maintenance' },
    { value: 'Cafeteria Admin', label: 'Cafeteria Admin', department: 'Cafeteria' },
    { value: 'Library Admin', label: 'Library Admin', department: 'Library' },
    { value: 'Transport Admin', label: 'Transport Admin', department: 'Transport' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    
    // Auto-set department based on role
    if (name === 'role') {
      const selectedRole = roles.find(r => r.value === value)
      if (selectedRole) {
        setFormData(prev => ({ ...prev, department: selectedRole.department }))
      }
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.role) {
      newErrors.role = 'Role is required'
    }

    return newErrors
  }

  const handleCreateAdmin = (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const newAdmin = {
      id: admins.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    }

    setAdmins(prev => [...prev, newAdmin])
    setShowCreateModal(false)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      department: ''
    })
    setErrors({})
    alert('Admin created successfully!')
  }

  const handleDeleteAdmin = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(prev => prev.filter(admin => admin.id !== id))
    }
  }

  const handleToggleStatus = (id) => {
    setAdmins(prev =>
      prev.map(admin =>
        admin.id === id
          ? { ...admin, status: admin.status === 'Active' ? 'Inactive' : 'Active' }
          : admin
      )
    )
  }

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'Hostel Admin': 'role-hostel',
      'Maintenance Admin': 'role-maintenance',
      'Cafeteria Admin': 'role-cafeteria',
      'Library Admin': 'role-library',
      'Transport Admin': 'role-transport'
    }
    return roleMap[role] || ''
  }

  return (
    <div className="admin-management-page">
      <AdminSidebar userRole={userRole} />
      
      <div className="management-content">
        <header className="management-header">
          <div>
            <h1>Admin Management</h1>
            <p className="header-subtitle">
              Create and manage admin accounts for different departments
            </p>
          </div>
          <div className="header-actions">
            <button
              className="create-admin-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bx bx-plus"></i>
              Create New Admin
            </button>
            <button className="logout-btn" onClick={onLogout}>
              <i className="bx bx-log-out"></i>
              Logout
            </button>
          </div>
        </header>

        <div className="management-body">
          <div className="admins-table-container">
            <div className="table-header">
              <h2>All Admins ({admins.length})</h2>
            </div>

            <table className="admins-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No admins found. Create your first admin.
                    </td>
                  </tr>
                ) : (
                  admins.map(admin => (
                    <tr key={admin.id}>
                      <td>#{admin.id}</td>
                      <td>
                        <div className="admin-name">
                          <strong>{admin.name}</strong>
                        </div>
                      </td>
                      <td>{admin.email}</td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(admin.role)}`}>
                          {admin.role}
                        </span>
                      </td>
                      <td>{admin.department}</td>
                      <td>
                        <span className={`status-badge ${admin.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td>{admin.createdAt}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="toggle-status-btn"
                            onClick={() => handleToggleStatus(admin.id)}
                            title={admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`bx ${admin.status === 'Active' ? 'bx-pause' : 'bx-play'}`}></i>
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            title="Delete Admin"
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Admin</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form className="create-admin-form" onSubmit={handleCreateAdmin}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter admin name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@campus.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  readOnly
                  className="readonly-input"
                />
                <small>Automatically set based on role</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManagement

