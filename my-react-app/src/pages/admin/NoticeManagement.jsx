import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import './NoticeManagement.css'
import { contentAPI } from '../../services/apiClient'

const NoticeManagement = ({ onLogout, userRole = 'Super Admin' }) => {
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState('')
  const [fetchError, setFetchError] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium',
    targetAudience: 'All Students',
    expiresAt: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadNotices = async () => {
    try {
      setLoading(true)
      const data = await contentAPI.getAllNotices()
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setNotices(sorted)
      setFetchError('')
    } catch (error) {
      setFetchError(error.message || 'Unable to load notices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const formatDate = (value) => {
    if (!value) return '—'
    try {
      return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return value
    }
  }

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

  const handleCreateNotice = async (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setIsSubmitting(true)
      setActionMessage('Creating notice...')
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        expiresAt: formData.expiresAt || null
      }
      const created = await contentAPI.createNotice(payload)
      setNotices(prev => [created, ...prev])
      setShowCreateModal(false)
      setFormData({
        title: '',
        content: '',
        priority: 'Medium',
        targetAudience: 'All Students',
        expiresAt: ''
      })
      setErrors({})
      setActionMessage('Notice created successfully')
    } catch (error) {
      setActionMessage(error.message || 'Failed to create notice')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setActionMessage(''), 3000)
    }
  }

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return
    }
    try {
      await contentAPI.deleteNotice(noticeId)
      setNotices(prev => prev.filter(notice => (notice._id || notice.id) !== noticeId))
      setActionMessage('Notice deleted')
    } catch (error) {
      setActionMessage(error.message || 'Failed to delete notice')
    } finally {
      setTimeout(() => setActionMessage(''), 3000)
    }
  }

  const handleToggleStatus = async (notice) => {
    const noticeId = notice._id || notice.id
    const nextStatus = notice.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await contentAPI.updateNotice(noticeId, { status: nextStatus })
      setNotices(prev =>
        prev.map(item =>
          (item._id || item.id) === noticeId ? { ...item, status: nextStatus } : item
        )
      )
      setActionMessage(`Notice ${nextStatus === 'Active' ? 'activated' : 'deactivated'}`)
    } catch (error) {
      setActionMessage(error.message || 'Failed to update status')
    } finally {
      setTimeout(() => setActionMessage(''), 3000)
    }
  }

  const getPriorityBadgeClass = (priority) => {
    const priorityMap = {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    }
    return priorityMap[priority] || ''
  }

  const handleRefresh = async () => {
    setActionMessage('Refreshing notices...')
    await loadNotices()
    setActionMessage('Notices updated')
    setTimeout(() => setActionMessage(''), 2000)
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
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={loading}
              >
                <i className={`bx ${loading ? 'bx-loader-alt bx-spin' : 'bx-refresh'}`}></i>
                Refresh
              </button>
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
          {actionMessage && (
            <div className="status-banner info">
              {actionMessage}
            </div>
          )}
          <div className="notices-table-container">
            <div className="table-header">
              <h2>All Notices ({notices.length})</h2>
            </div>

            <div className="notices-grid">
              {loading ? (
                <div className="no-data">
                  <i className="bx bx-loader-alt bx-spin"></i>
                  Loading notices...
                </div>
              ) : fetchError ? (
                <div className="no-data error-text">
                  {fetchError}
                </div>
              ) : notices.length === 0 ? (
                <div className="no-data">
                  No notices found. Create your first notice.
                </div>
              ) : (
                notices.map(notice => (
                  <div key={notice._id || notice.id} className="notice-card">
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
                          <span><i className="bx bx-calendar"></i> {formatDate(notice.createdAt)}</span>
                          {notice.expiresAt && (
                            <span><i className="bx bx-time"></i> Expires: {formatDate(notice.expiresAt)}</span>
                          )}
                      </div>
                      <div className="notice-actions">
                        <button
                          className="toggle-status-btn"
                            onClick={() => handleToggleStatus(notice)}
                          title={notice.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`bx ${notice.status === 'Active' ? 'bx-pause' : 'bx-play'}`}></i>
                        </button>
                        <button
                          className="delete-btn"
                            onClick={() => handleDeleteNotice(notice._id || notice.id)}
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
                <button type="submit" className="create-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Create Notice'}
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

