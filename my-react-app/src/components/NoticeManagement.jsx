import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import './NoticeManagement.css'

const NoticeManagement = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Hostel Maintenance Schedule',
      content: 'Scheduled maintenance work will be carried out in Block A from 10 AM to 2 PM on January 20th. Please cooperate.',
      priority: 'High',
      targetAudience: 'All Students',
      status: 'Active',
      createdAt: '2024-01-15',
      expiresAt: '2024-01-25'
    },
    {
      id: 2,
      title: 'Library Extended Hours',
      content: 'Library will remain open until 10 PM during exam period for your convenience.',
      priority: 'Medium',
      targetAudience: 'All Students',
      status: 'Active',
      createdAt: '2024-01-10',
      expiresAt: '2024-02-10'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium',
    targetAudience: 'All Students',
    expiresAt: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }

    return newErrors
  }

  const handleCreateNotice = (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const newNotice = {
      id: notices.length + 1,
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: formData.expiresAt || null
    }

    setNotices(prev => [newNotice, ...prev])
    setShowCreateModal(false)
    setFormData({
      title: '',
      content: '',
      priority: 'Medium',
      targetAudience: 'All Students',
      expiresAt: ''
    })
    setErrors({})
    alert('Notice created successfully!')
  }

  const handleDeleteNotice = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(prev => prev.filter(notice => notice.id !== id))
    }
  }

  const handleToggleStatus = (id) => {
    setNotices(prev =>
      prev.map(notice =>
        notice.id === id
          ? { ...notice, status: notice.status === 'Active' ? 'Inactive' : 'Active' }
          : notice
      )
    )
  }

  const getPriorityBadgeClass = (priority) => {
    const priorityMap = {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    }
    return priorityMap[priority] || ''
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/adminpannel')
  }

  return (
    <div className="notice-management-page">
      <AdminSidebar userRole={userRole} />
      
      <div className="notice-wrapper">
        <header className="notice-header">
          <div className="header-content">
            <div>
              <h1>Notice Management</h1>
              <p className="header-subtitle">
                Create and manage notices for students and users
              </p>
            </div>
            <div className="header-actions">
              <button
                className="create-notice-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bx bx-plus"></i>
                Create Notice
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bx bx-log-out"></i>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="notice-content">
          <div className="notices-table-container">
            <div className="table-header">
              <h2>All Notices ({notices.length})</h2>
            </div>

            <div className="notices-grid">
              {notices.length === 0 ? (
                <div className="no-data">
                  No notices found. Create your first notice.
                </div>
              ) : (
                notices.map(notice => (
                  <div key={notice.id} className="notice-card">
                    <div className="notice-card-header">
                      <div>
                        <h3>{notice.title}</h3>
                        <span className={`priority-badge ${getPriorityBadgeClass(notice.priority)}`}>
                          {notice.priority}
                        </span>
                      </div>
                      <span className={`status-badge ${notice.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {notice.status}
                      </span>
                    </div>

                    <div className="notice-card-body">
                      <p>{notice.content}</p>
                    </div>

                    <div className="notice-card-footer">
                      <div className="notice-meta">
                        <span><i className="bx bx-user"></i> {notice.targetAudience}</span>
                        <span><i className="bx bx-calendar"></i> {notice.createdAt}</span>
                        {notice.expiresAt && (
                          <span><i className="bx bx-time"></i> Expires: {notice.expiresAt}</span>
                        )}
                      </div>
                      <div className="notice-actions">
                        <button
                          className="toggle-status-btn"
                          onClick={() => handleToggleStatus(notice.id)}
                          title={notice.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`bx ${notice.status === 'Active' ? 'bx-pause' : 'bx-play'}`}></i>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteNotice(notice.id)}
                          title="Delete Notice"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Notice</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form className="create-notice-form" onSubmit={handleCreateNotice}>
              <div className="form-group">
                <label>Notice Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter notice title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  name="content"
                  placeholder="Enter notice content..."
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                />
                {errors.content && <span className="error-message">{errors.content}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Audience</label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                  >
                    <option value="All Students">All Students</option>
                    <option value="Hostel Residents">Hostel Residents</option>
                    <option value="Day Scholars">Day Scholars</option>
                    <option value="All Users">All Users</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date (Optional)</label>
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                />
                <small>Leave empty for no expiry</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticeManagement

